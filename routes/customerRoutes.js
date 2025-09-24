import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controllers/customerController.js";

import { protect,authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("staff", "admin", "superadmin"), getCustomers)
  .post(protect, authorize("staff","admin", "superadmin"), createCustomer);

router
  .route("/:id")
  .get(protect, authorize("staff", "admin", "superadmin"), getCustomerById)
  .put(protect, authorize("staff", "admin", "superadmin"), updateCustomer)
  .delete(protect, authorize("admin","superadmin"), deleteCustomer);

export default router;
