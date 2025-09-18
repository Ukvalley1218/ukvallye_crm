import User from "../models/User.js";

// @desc    Create a new user
// @route   POST /api/users
// @access  Public / SuperAdmin
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Admin / SuperAdmin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Admin / SuperAdmin
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin / SuperAdmin
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password; // will rehash because of pre-save hook
    user.role = role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin / SuperAdmin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();

    res.json({ message: "User removed" });
  } catch (err) {
    next(err);
  }
};