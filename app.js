const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");
const cartRouter = require("./routers/cartRouter");
const paymentRouter = require("./routers/paymentRouter");

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/payment", paymentRouter);

module.exports = app;
