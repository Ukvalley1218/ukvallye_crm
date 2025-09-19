// controllers/noteController.js
import Note from "../models/Notes.js";

// @desc Get all notes
// @desc Get all notes with filters
export const getNotes = async (req, res, next) => {
  try {
    const { leadid, customerid, staffid, tag, search, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (leadid) filter.leadid = leadid;
    if (customerid) filter.customerid = customerid;
    if (staffid) filter.staffid = staffid;
    if (tag) filter.tags = { $in: [tag] }; // filter notes containing a tag

    // Text search inside content
    if (search) {
      filter.content = { $regex: search, $options: "i" }; // case-insensitive
    }

    // Date range filter (createdAt)
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

    // Count total documents for pagination info
    const total = await Note.countDocuments(filter);

    const notes = await Note.find(filter)
      .populate("leadid")
      .populate("customerid")
      .populate("staffid")
      .sort({ createdAt: -1 }) // optional: latest notes first
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
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// @desc Create new note
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    await note.populate("leadid");
    await note.populate("customerid");
    await note.populate("staffid");
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// @desc Update note
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    await note.populate("leadid");
    await note.populate("customerid");
    await note.populate("staffid");
    res.json(note);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

// @desc Delete note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};
