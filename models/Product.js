const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const productSchema = new mongoose.Schema({
  name: { type: String,required: true, },
  description: { type: String,required: true, },
  price: {
    type: Number,
    required: true,
    min: 0.01, // Enforce a minimum positive price
  },
  stockCount:{type: Number, default: 0,min: 0, // Enforce non-negative stock
    }
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference the Category model (optional)
  },
  photo:[String],
  discount:{type: String, default: true},
  stock_status:{type: Boolean, default: true},
  status:{type: String, default: "Active"},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Product", productSchema);
