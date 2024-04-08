const { Order } = require("../models/order");

module.exports.newOrder = async (req, res) => {
    const order = new Order(req.body);
    try {
      await order.save();
      return res.status(201).send("order placed successfully");
    } catch (err) {
      return res.status(400).send("sorry! something went wrong");
    }
  };

  module.exports.orderList = async (req, res) => {
    const orders = await Order.find({ userId: req.user._id }).sort({
      orderTime: -1,
    });
    res.send(orders);
  };