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
    // From Lead
    name: { type: String, trim: true }, // person name
    position: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },

    // Company Info
    company: { type: String, required: true },

    // Address info (flat)
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, default: "India" },

    // Lead-specific fields
    title: { type: String, default: "Other" },
    leadValue: { type: Number, default: 0 },
    status: { type: String, default: "Non selected" }, // dropdown
    source: { type: String, default: "Non selected" }, // dropdown

    assign: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
    ],
    tags: [{ type: String }],

    description: { type: String },
    public: { type: Boolean, default: false },
    contactedToday: { type: Boolean, default: false },
    referer: { type: String, trim: true },
    leadType: { type: String, default: "Other" },

    defaultLanguage: { type: String, default: "System Default" },

    // Calendar fields
    start: { type: Date },
    end: { type: Date },

    // Customer-specific fields
    groups: { type: String, trim: true },
    currency: { type: String, default: "System Default" },

    // Addresses
    billingAddress: addressSchema,
    shippingAddress: addressSchema
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
