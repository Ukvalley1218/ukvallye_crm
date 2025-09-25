// controllers/customerController.js
import Customer from "../models/Customer.js";


// @desc Get all customers


// @desc Get all customers with filters
export const getCustomers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, search, ...query } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const filter = { ...query };

    // Search by company
    if (search) {
      filter.company = { $regex: search, $options: "i" };
    }

    // Staff only see assigned customers
    if (req.user.role === "staff") {
      filter.assign = { $in: [req.user._id] };
    }

    const total = await Customer.countDocuments(filter);

    const customers = await Customer.find(filter)
      .populate("assign", "name email role")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      customers,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};




// @desc Create customer
export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

// @desc Get single customer
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "assign",
      "name email role"
    );

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Staff can only see their assigned customers
    if (req.user.role === "staff") {
  const isAssigned = customer.assign.some(
    (staff) => staff._id.toString() === req.user._id.toString()
  );
  if (!isAssigned) {
    return res.status(403).json({ message: "Access denied" });
  }
}


    res.json(customer);
  } catch (err) {
    next(err);
  }
};



// @desc Update customer
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Staff can only update their own customers
    if (req.user.role === "staff" && !customer.assign.some(id => id.toString() === req.user._id.toString())) {
  return res.status(403).json({ message: "Access denied" });
}


    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};


// @desc Delete customer
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Only superadmin can delete → route already enforces it
    await customer.deleteOne();
    res.json({ message: "Customer removed" });
  } catch (err) {
    next(err);
  }
};
