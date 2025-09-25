import Lead from "../models/Lead.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import { notifyUser } from "../utils/notify.js";

// @desc Get all leads with filters
export const getLeads = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      city,
      state,
      country,
      status,
      source,
      assign,
      tag,
      leadType,
      publicOnly,
      contactedToday,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // 🔹 Role-based filtering
    if (req.user.role === "staff") {
      filter.assign = req.user._id; // staff → only their leads
    } else if (req.user.role === "admin") {
      // Admin can see all leads, but optionally filter by "assign"
      if (assign) filter.assign = assign;
    } else if (req.user.role === "superadmin") {
      // Superadmin sees all leads, but can still apply query filters
      if (assign) filter.assign = assign;
    }

    // Filters
    if (name) filter.name = { $regex: name, $options: "i" };
    if (email) filter.email = { $regex: email, $options: "i" };
    if (phone) filter.phone = { $regex: phone, $options: "i" };
    if (company) filter.company = { $regex: company, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };
    if (country) filter.country = country;
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (leadType) filter.leadType = leadType;
    if (tag) filter.tags = { $in: [tag] };
    if (publicOnly === "true") filter.public = true;
    if (contactedToday === "true") filter.contactedToday = true;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(filter);

    const leads = await Lead.find(filter)
      .populate("assign", "name email phone")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
      data: leads,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get single lead
export const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assign",
      "name email phone"
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Staff can only see their leads
    if (req.user.role === "staff" && lead.assign.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// @desc Create new lead
export const createLead = async (req, res, next) => {
  try {
    // Normalize assign to array of User ObjectIds
    const assignInput = req.body.assign;
    const assignedUserIds = Array.isArray(assignInput)
      ? assignInput.filter(Boolean)
      : [assignInput || req.user._id].filter(Boolean);

    const newLead = await Lead.create({
      ...req.body,
      assign: assignedUserIds,
      referer:req.user.name,
    });

    // 🔹 Notify assigned users individually
    for (const assignedUserId of assignedUserIds) {
      const user = await User.findById(assignedUserId).select("_id");
      if (user) {
        await notifyUser({
          userId: assignedUserId, // ✅ send to individual user
          type: "lead_assigned",
          message: `You have been assigned a new lead: ${newLead.name}`,
          link: `/leads/${newLead._id}`,
        });
      }
    }
   

    res.status(201).json(newLead);
  } catch (err) {
    console.error("Error in createLead:", err);
    next(err);
  }
};


// @desc Update lead
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Staff → can only update their own leads
    // if (req.user.role === "staff" && lead.assign.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // notifications only on create, not on update
    res.json(updatedLead);
  } catch (err) {
    next(err);
  }
};

// @desc Delete lead
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Only admin & superadmin can delete
    // if (req.user.role === "staff") {
    //   return res.status(403).json({ message: "Only admin/superadmin can delete" });
    // }

    await lead.deleteOne();
    res.json({ message: "Lead deleted" });
  } catch (err) {
    next(err);
  }
};

// @desc Convert Lead to Customer and delete Lead
// @route POST /api/customers/convert/:leadId
// @access Private
export const convertLeadToCustomer = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    // 1️⃣ Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // 2️⃣ Check if customer already exists (optional but recommended)
    const existingCustomer = await Customer.findOne({
      $or: [
        { company: lead.company },
        { phone: lead.phone },
        { address: lead.address }
      ]
    });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists with similar details" });
    }

    // 3️⃣ Create a new Customer from Lead fields
    const newCustomer = await Customer.create({
      company: lead.company || lead.name, // fallback to lead name if company is empty
      phone: lead.phone,
      website: lead.website,
      address: lead.address,
      city: lead.city,
      state: lead.state,
      zipCode: lead.zipCode,
      country: lead.country,

      referar: lead.referer, // mapping lead.referer to customer.referar
      leadType: lead.leadType,
      assign: lead.assign,
      defaultLanguage: lead.defaultLanguage,
      groups: "", // set default or dynamic
      // billingAddress: {}, // optional mapping
      // shippingAddress: {}, // optional mapping
    });

    // 4️⃣ Delete the lead after conversion
    await Lead.findByIdAndDelete(leadId);

    res.status(201).json({
      message: "Lead converted to Customer successfully and deleted from Leads",
      customer: newCustomer,
    });
  } catch (error) {
    next(error);
  }
};


// create/update lead APIs so that if you pass staff name instead of _id, it will automatically
// @desc Get all leads
// export const getLeads = async (req, res, next) => {
//   try {
//     const leads = await Lead.find().populate("assign", "name email phone");
//     res.json(leads);
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc Get single lead
// export const getLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findById(req.params.id).populate("assign", "name email phone");
//     if (!lead) return res.status(404).json({ message: "Lead not found" });
//     res.json(lead);
//   } catch (err) {
//     next(err);
//   }
// };

// // Helper: resolve staff assign field (by name or id)
// const resolveAssignField = async (assignInput) => {
//   if (!assignInput) return null;

//   let staffIds = [];

//   for (let item of Array.isArray(assignInput) ? assignInput : [assignInput]) {
//     if (typeof item === "string" && item.match(/^[0-9a-fA-F]{24}$/)) {
//       // ✅ already a Mongo ObjectId string
//       staffIds.push(item);
//     } else {
//       // ✅ treat as staff name, find staff
//       const staff = await Staff.findOne({ name: item });
//       if (staff) staffIds.push(staff._id);
//     }
//   }

//   return staffIds.length > 0 ? staffIds : null;
// };

// // @desc Create new lead
// export const createLead = async (req, res, next) => {
//   try {
//     if (req.body.assign) {
//       req.body.assign = await resolveAssignField(req.body.assign);
//     }

//     const lead = await Lead.create(req.body);
//     const populatedLead = await lead.populate("assign", "name email phone");
//     res.status(201).json(populatedLead);
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc Update lead
// export const updateLead = async (req, res, next) => {
//   try {
//     if (req.body.assign) {
//       req.body.assign = await resolveAssignField(req.body.assign);
//     }

//     const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     }).populate("assign", "name email phone");

//     if (!lead) return res.status(404).json({ message: "Lead not found" });
//     res.json(lead);
//   } catch (err) {
//     next(err);
//   }
// };

// // @desc Delete lead
// export const deleteLead = async (req, res, next) => {
//   try {
//     const lead = await Lead.findByIdAndDelete(req.params.id);
//     if (!lead) return res.status(404).json({ message: "Lead not found" });
//     res.json({ message: "Lead deleted" });
//   } catch (err) {
//     next(err);
//   }
// };
