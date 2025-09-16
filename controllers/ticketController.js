import Ticket from "../models/Ticket.js";

// Customer raises ticket
export const createTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user.id, // logged in user
    });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

// Get all tickets (Admin/Staff)
export const getAllTickets = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await Ticket.find(filter)
      .populate("customer", "name email")
      .populate("assignedStaff", "name email");

    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// Get single ticket
export const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "name email")
      .populate("assignedStaff", "name email");

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// Update ticket (assign staff / change status)
export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

// Delete ticket
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    next(err);
  }
};

// Get my tickets (Customer sees only their own)
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ customer: req.user.id });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};