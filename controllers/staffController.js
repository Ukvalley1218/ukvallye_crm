// controllers/UserController.js
import User from "../models/User.js";
import Lead from "../models/Lead.js";



// @desc Search User by name and return their leads
// @desc Search User by name and return their leads
export const searchUserWithLeads = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    // Find all User with matching name (case-insensitive, partial)
    const UserList = await User.find({
      name: { $regex: name, $options: "i" },
    });

    if (!UserList.length) {
      return res.status(404).json({ message: "No User found" });
    }

    // For each User, get their leads
    const UserWithLeads = await Promise.all(
      UserList.map(async (User) => {
        const leads = await Lead.find({ assign: User._id });
        return { User, leads };
      })
    );

    res.json(UserWithLeads);
  } catch (err) {
    next(err);
  }
};


// Optionally: Get leads by UserId
export const getUserLeads = async (req, res, next) => {
  try {
    // staff can only see their own leads
    if (req.user.role === "staff" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const leads = await Lead.find({ assign: req.params.id });

    res.json({ user, leads });
  } catch (err) {
    next(err);
  }
};

// @desc Get all User (with optional filters and pagination)
export const getUsers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const filters = {};

    if (req.query.name) {
      filters.name = { $regex: req.query.name, $options: "i" };
    }
    if (req.query.email) {
      filters.email = { $regex: req.query.email, $options: "i" };
    }
    if (req.query.phone) {
      filters.phone = { $regex: req.query.phone, $options: "i" };
    }
    if (req.query.address) {
      filters.address = { $regex: req.query.address, $options: "i" };
    }

    const total = await User.countDocuments(filters);

    const staffs = await User.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      staffs,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    next(err);
  }
};


// @desc Get single User
export const getUser = async (req, res, next) => {
  try {
    // staff can only see their own profile
    if (req.user.role === "staff" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};


// @desc Create new User
export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// @desc Update User
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
