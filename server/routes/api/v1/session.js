var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
var userService = require("../../../services").users;
var HttpStatus = require("http-status-codes");

router.post("/signup", function(req, res) {
  console.log("here1");
  userService.createUser(req.body, (err, data) => {
    console.log("here");

    if (err) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        error: err.message
      });
    }
    res.json(data);
  });
});

router.post("/login", function(req, res) {
  userService.authenticate(req.body, (err, user) => {
    if (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: err.message
      });
    }

    user.generateToken((err, token) => {
      if (err) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: err.message
        });
      }
      user.lastLogin = new Date();
      user.save(() => {
        res.json({ token: token, _id: user._id });
      });
    });
  });
});

router.get(
  "/logout",
  jwt({ secret: process.env["SECRET_KEY"], credentialsRequired: false }),
  async function(req, res) {
    const user = await userService.logout(req.user._id);
    res.json(user);
  }
);

router.post("/forgot_password", function(req, res) {
  userService.forgotPassword(req.body, (err, token) => {
    if (err) return res.json({ error: err.message });
    res.json({ token });
  });
});

router.post("/update_password", function(req, res) {
  userService.updatePassword(req.body, err => {
    if (err) return res.json({ error: err.message });
    res.json({ status: true });
  });
});

module.exports = router;
