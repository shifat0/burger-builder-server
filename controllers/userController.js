const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");

module.exports.newUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("User already registered with this email");

  user = new User(_.pick(req.body, ["email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = await user.generateJWT();
  const result = await user.save();

  return res.status(201).send({
    token: token,
    user: _.pick(result, ["_id", "email"]),
  });
};

module.exports.authUser = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid User or Password");

  const validUser = await bcrypt.compare(req.body.password, user.password);
  if (!validUser) return res.status(400).send("Invalid User or Password");

  const token = await user.generateJWT();

  return res.status(201).send({
    token: token,
    user: _.pick(user, ["_id", "email"]),
  });
};
