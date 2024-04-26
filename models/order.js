const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  userId: Schema.Types.ObjectId,
  ingredients: [{ type: { type: String }, amount: Number }],
  customer: {
    deliveryAddress: String,
    city: String,
    state: String,
    postcode: String,
    phone: String,
    paymentType: String,
  },
  transaction_id: {
    type: String,
    default: "",
    unique: true,
  },
  price: Number,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Paid"],
  },
  sessionKey: String,
  orderTime: { type: Date, default: Date.now },
});

module.exports.Order = model("Order", orderSchema);
