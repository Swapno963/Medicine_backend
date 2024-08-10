const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

const categorySchema = new mongoose.Schema(
  {
    category: { type: String, unique: true },
    slug: { type: String, slug: "category" },
  },
  { timestamps: true }
);

// for generating slug
categorySchema.pre("save", function (next) {
  this.slug = this.category.split(" ").join("-");
  next();
});
module.exports = mongoose.model("Category", categorySchema);
