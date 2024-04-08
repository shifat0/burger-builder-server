const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);

module.exports = app;
