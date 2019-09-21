const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

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
          "A user with specified email could not be found."
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
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
