const mongoose = require("mongoose");
//const validate = require("mongoose-validator");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Category is required!!"],
    minLength: 3,
    maxLength: 25,
    unique: true,
  },
  timestamp: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Category", categorySchema);
