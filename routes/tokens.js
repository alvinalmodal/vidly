const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const validateCredential = require("../validators/token");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const errors = validateCredential(req.body);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send("Invalid username/password.");
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).send("Invalid username/password.");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        roles: user.roles.map((value) => value.name),
      },
      process.env.JWT_SECRET
    );

    return res.send({ token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
