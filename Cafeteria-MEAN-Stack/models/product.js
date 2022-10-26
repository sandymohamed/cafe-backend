const mongoose = require("mongoose");
//const validate = require("mongoose-validator");

const prodctSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required!!"],
    trim: true,
    unique: true,
    minLength: 3,
    maxLength: 25,
  },
  price: {
    type: Number,
    required: [true, "Product price is required!!"],
  },
  IsAvailable :{
    type:Boolean ,
    default:true ,
  },
  img: {
    type: String,
    required: [true, "Product image is required!!"],
    trim: true,
    unique: true,
  },
  size: {
    type: String,
    enum: ["sm", "md", "lg"],
    default: "sm",
  },
  timestamp: { type: Date, default: Date.now() },
  productTo: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

module.exports = mongoose.model("Product", prodctSchema);
