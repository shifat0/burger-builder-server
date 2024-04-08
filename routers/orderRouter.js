const router = require("express").Router();
const authorize = require("../middlewares/authorize");
const { newOrder, orderList } = require("../controllers/orderController");

router.route("/").get(authorize, orderList).post(authorize, newOrder);

module.exports = router;
