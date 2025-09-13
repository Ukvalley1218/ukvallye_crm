// controllers/noteController.js
import Note from "../models/Notes.js";

// @desc Get all notes
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find()
      .populate("leadId")
      .populate("customerId")
      .populate("staffId");

    res.json(notes);
  } catch (err) {
    next(err);
  }
};

// @desc Get single note
export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("leadId")
      .populate("customerId")
      .populate("staffId");

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
