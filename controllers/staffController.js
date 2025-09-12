// controllers/staffController.js
import Staff from "../models/Staff.js";

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
