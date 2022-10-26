const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date ,default :  Date.now(), required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true },
  action: { type: String },
  room: { type: Number, required: true },
  ext: { type: Number, required: true },
  Prodeuct :[{type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]

},
  { timestamps: true }

);


const OrderModel = mongoose.model('order', OrderSchema)

module.exports = OrderModel;
