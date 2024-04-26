const { Schema, model } = require("mongoose");

const CartItemSchema = Schema(
  {
    ingredients: [{ type: { type: String }, amount: Number }],
    customer: {
      deliveryAddress: String,
      city: String,
      state: String,
      postcode: String,
      phone: String,
      paymentType: String,
    },
    price: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports.CartItemSchema = CartItemSchema;
module.exports.CartItem = model("CartItem", CartItemSchema);
