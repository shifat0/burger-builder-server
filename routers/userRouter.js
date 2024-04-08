const router = require("express").Router();
const { newUser, authUser } = require("../controllers/userController");

router.route("/").post(newUser);
router.route("/auth").post(authUser);

module.exports = router;
