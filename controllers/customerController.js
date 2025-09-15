// controllers/customerController.js
import Customer from "../models/Customer.js";


// @desc Get all customers


// @desc Get all customers with filters
export const getCustomers = async (req, res, next) => {
  try {
    const { 
      company, 
      city, 
      state, 
      country, 
      groups, 
      leadType, 
      assign, 
      search, 
      startDate, 
      endDate 
    } = req.query;

    const filter = {};

    if (company) filter.company = { $regex: company, $options: "i" }; // case-insensitive
    if (city) filter.city = { $regex: city, $options: "i" };
    if (state) filter.state = { $regex: state, $options: "i" };
    if (country) filter.country = country;
    if (groups) filter.groups = groups;
    if (leadType) filter.leadType = leadType;
    if (assign) filter.assign = assign; // filter by assigned staff

    // Global search (company, phone, website)
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { website: { $regex: search, $options: "i" } },
        { referar: { $regex: search, $options: "i" } }
      ];
    }

    // Date range filter (createdAt)
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const customers = await Customer.find(filter)
      .populate("assign", "name email role"); // show staff details

    res.json(customers);
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
    const customer = await Customer.findById(req.params.id).populate("assign", "name email role");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// @desc Update customer
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

// @desc Delete customer
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer removed" });
  } catch (err) {
    next(err);
  }
};
