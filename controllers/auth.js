const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hashPw => {
      const user = new User({
        email,
        password: hashPw,
        name
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signin = (req, res, next) => {
  const { email, password } = req.body;
  let foundUser;
  User.findOne({ email: email })
    .then(userDoc => {
      if (!userDoc) {
        const error = new Error(
          "Please make sure you enter correct email and password."
        );
        error.statusCode = 401;
        throw error;
      }
      foundUser = userDoc;
      return bcrypt.compare(password, foundUser.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error(
          "Please make sure you enter correct email and password."
        );
        error.statusCode = 401;
        throw error;
      }
      const email = foundUser.email;
      const userId = foundUser._id.toString();
      const secret = config.JWT_SECRECT;
      const token = jwt.sign({ email, userId }, secret, { expiresIn: "1h" });
      res.status(200).json({ token, userId });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
