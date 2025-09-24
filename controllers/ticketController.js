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

    if (req.user.role === "staff") {
      // Staff sees only tickets assigned to them or unassigned
      filter.$or = [
        { assignedStaff: req.user._id },
        { assignedStaff: { $exists: false } },
      ];
    }

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

    // Customers can only see their own ticket
    if (req.user.role === "customer" && ticket.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Staff can see only assigned tickets or unassigned
    if (req.user.role === "staff" && ticket.assignedStaff && ticket.assignedStaff._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};


// Update ticket (assign staff / change status)
export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (req.user.role === "staff" && ticket.assignedStaff?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(ticket, req.body);
    await ticket.save();
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
    const tickets = await Ticket.find({ customer: req.user._id })
      .populate("assignedStaff", "name email");
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};
