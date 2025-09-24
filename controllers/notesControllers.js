// controllers/noteController.js
import Note from "../models/Notes.js";

// @desc Get all notes
// @desc Get all notes with filters
export const getNotes = async (req, res, next) => {
  try {
    const { leadid, customerid, staffid, tag, search, startDate, endDate, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Staff can only see their own notes
    if (req.user.role === "staff") {
      filter.staffid = req.user._id;
    } else {
      if (staffid) filter.staffid = staffid; // allow admin/superadmin to filter
    }

    if (leadid) filter.leadid = leadid;
    if (customerid) filter.customerid = customerid;
    if (tag) filter.tags = { $in: [tag] };

    if (search) {
      filter.content = { $regex: search, $options: "i" };
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Note.countDocuments(filter);

    const notes = await Note.find(filter)
      .populate("leadid")
      .populate("customerid")
      .populate("staffid")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      limit: limitNumber,
      data: notes,
    });
  } catch (err) {
    next(err);
  }
};



// @desc Get single note
export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("leadid")
      .populate("customerid")
      .populate("staffid");

    if (!note) return res.status(404).json({ message: "Note not found" });

    // Staff can only see their own note
    if (req.user.role === "staff" && note.staffid.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};


// @desc Create new note
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      staffid: req.user._id, // auto-assign staff creating the note
    });
    await note.populate("leadid customerid staffid");
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// @desc Update note
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (req.user.role === "staff" && note.staffid.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(note, req.body);
    await note.save();
    await note.populate("leadid customerid staffid");
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// @desc Delete note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (req.user.role === "staff" && note.staffid.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};

