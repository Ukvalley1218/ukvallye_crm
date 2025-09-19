// models/Customer.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, trim: true }
});

const customerSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, default: "India" },

    groups: { type: String, trim: true },
    currency: { type: String, default: "System Default" },
    defaultLanguage: { type: String, default: "System Default" },

    billingAddress: addressSchema,
    shippingAddress: addressSchema,

    referar: { type: String, trim: true },
    leadType: { type: String, trim: true },

    assign: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , default: null }],
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
