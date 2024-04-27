const PaymentSession = require("ssl-commerz-node").PaymentSession;
const { CartItem } = require("../models/cartItem");
const { Order } = require("../models/order");
const { Payment } = require("../models/payment");
const path = require("path");

// Request a Session
// Payment Process
// Receive IPN
// Create an Order

module.exports.ipn = async (req, res) => {
  console.log(req.body);
  const payment = new Payment(req.body);
  const tran_id = payment["tran_id"];
  if (payment["status"] === "VALID") {
    const order = await Order.updateOne(
      { transaction_id: tran_id },
      { status: "Paid" }
    );
  } else {
    await CartItem.deleteOne({ user: req.user._id, transaction_id: tran_id });
  }
  await payment.save();
  return res.status(200).send("IPN");
};

module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;
  const cart = await CartItem.findOne({ user: userId });

  const { customer, user, price, ingredients } = cart;

  const tran_id =
    "_" + Math.random().toString(36).substr(2, 9) + new Date().getTime();

  const payment = new PaymentSession(
    true,
    process.env.STORE_ID,
    process.env.STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success:
      "https://burger-builder-server-3ad9.onrender.com/api/v1/payment/success",
    // success: "http://localhost:5000/success",
    fail: "yoursite.com/fail", // If payment failed
    cancel: "yoursite.com/cancel", // If user cancel payment
    ipn: "https://burger-builder-server-3ad9.onrender.com/api/v1/payment/ipn",
  });

  // Set order details
  payment.setOrderInfo({
    total_amount: price, //total_amount, // Number field
    currency: "BDT", // Must be three character string
    tran_id: tran_id, // Unique Transaction id
    emi_option: 0, // 1 or 0
  });

  // Set customer info
  payment.setCusInfo({
    name: req.user.name,
    email: req.user.email,
    add1: customer.deliveryAddress,
    add2: customer.deliveryAddress,
    city: customer.city,
    state: customer.state,
    postcode: customer.postcode,
    country: "Bangladesh",
    phone: customer.phone,
    fax: customer.phone,
  });

  // Set shipping info
  payment.setShippingInfo({
    method: "No",
    num_item: 1,
    name: req.user.name,
    add1: customer.deliveryAddress,
    add2: customer.deliveryAddress,
    city: customer.city,
    state: customer.state,
    postcode: customer.postcode,
    country: "Bangladesh",
  });

  // Set Product Profile
  payment.setProductInfo({
    product_name: "Burger Builder",
    product_category: "General",
    product_profile: "general",
  });

  response = await payment.paymentInit();
  // console.log(response);
  const order = new Order({
    user: user,
    transaction_id: tran_id,
    customer: customer,
    price: price,
    ingredients: ingredients,
  });
  if (response.status === "SUCCESS") {
    order.sessionKey = response["sessionkey"];
    await order.save();
  }
  return res.status(200).send(response);
};

module.exports.paymentSuccess = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/success.html"));
};
