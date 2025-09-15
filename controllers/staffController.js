// controllers/staffController.js
import Staff from "../models/Staff.js";
import Lead from "../models/Lead.js";



// @desc Search staff by name and return their leads
// @desc Search staff by name and return their leads
export const searchStaffWithLeads = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    // Find all staff with matching name (case-insensitive, partial)
    const staffList = await Staff.find({
      name: { $regex: name, $options: "i" },
    });

    if (!staffList.length) {
      return res.status(404).json({ message: "No staff found" });
    }

    // For each staff, get their leads
    const staffWithLeads = await Promise.all(
      staffList.map(async (staff) => {
        const leads = await Lead.find({ assign: staff._id });
        return { staff, leads };
      })
    );

    res.json(staffWithLeads);
  } catch (err) {
    next(err);
  }
};


// Optionally: Get leads by staffId
export const getStaffLeads = async (req, res, next) => {
  try {
    const staffId = req.params.id;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const leads = await Lead.find({ assign: staffId });

    res.json({
      staff,
      leads,
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get all staff
export const getStaffs = async (req, res, next) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (err) {
    next(err);
  }
};

// @desc Get single staff
export const getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    next(err);
  }
};

// @desc Create new staff
export const createStaff = async (req, res, next) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (err) {
    next(err);
  }
};

// @desc Update staff
export const updateStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    next(err);
  }
};

// @desc Delete staff
export const deleteStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted" });
  } catch (err) {
    next(err);
  }
};
