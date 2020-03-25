var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
var userService = require("../../../services").users;

router.post("/signup", function(req, res) {
  userService.createNew(req.body, (err, data) => {
    if (err) {
      return res.status(422).json({
        error: err.message
      });
    }
    res.json(data);
  });
});

router.post("/login", function(req, res) {
  userService.authenticate(req.body, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: err.message
      });
    }

    user.generateToken((err, token) => {
      if (err) {
        return res.status(401).json({
          error: err.message
        });
      }
      user.lastLogin = new Date();
      user.save(() => {
        res.json({ token: token });
      });
    });
  });
});

router.get(
  "/logout",
  jwt({ secret: process.env["SECRET_KEY"], credentialsRequired: false }),
  function(req, res) {
    const user = req.user;
    if (!user) res.end();
    user.token = null;
    user.save(() => res.end());
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
