import Lead from "../models/Lead.js";
import Staff from "../models/Staff.js";
// controllers/leadController.js

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
      page = 1, // default page
      limit = 10, // default limit
    } = req.query;

    const filter = {};
    // 🔹 Role-based access
    // if (req.user.role === "staff") {
    //   filter.assign = req.user._id; // staff can only see their leads
    // } else if (assign) {
    //   // for admins/managers, allow optional filter by assign
    //   filter.assign = assign;
    // }

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
    if (assign) filter.assign = assign;
    if (tag) filter.tags = { $in: [tag] };

    if (publicOnly === "true") filter.public = true;
    if (contactedToday === "true") filter.contactedToday = true;

    // Global text search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Date range filter
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    // Convert to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Count total documents
    const total = await Lead.countDocuments(filter);

    // Fetch paginated results
    const leads = await Lead.find(filter)
      .populate("assign", "name email phone")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // optional: newest first

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
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// @desc Create new lead
export const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      //assign: req.user._id, // store auth user ID here
    });
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

// @desc Update lead
export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// @desc Delete lead
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (err) {
    next(err);
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
