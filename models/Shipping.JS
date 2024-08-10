const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const shippingSchema = new mongoose.Schema({
  deivision: { type: String, required: true },
  district: { type: String, required: true },
  sub_districtsub: { type: String, required: true },
  sub_districtsub: { type: String, required: true },
  address: { type: String, required: true },
  name: { type: String, required: true },
  phone: {
    type: Number,
    required: true,
  },
  status: { type: String, default: "Active" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shipping", shippingSchema);
