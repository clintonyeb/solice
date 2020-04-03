var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
var userService = require("../../../services").users;
var HttpStatus = require("http-status-codes");
const email = require("../../../services/email");
const axios = require("axios");
const qs = require("qs");

router.post("/signup", async function(req, res) {
  try {
    validateCaptcha(req);
    userService.createUser(req.body, (err, data) => {
      if (err) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          error: err.message
        });
      }
      res.json(data);

      data.generateToken((err, token) => {
        const url = req.protocol + "://" + req.headers.host + "/api/v1";
        email.sendEmailVerification(data, url, token);
      });
    });
  } catch (error) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ error: error.message });
  }
});

function validateCaptcha(req) {
  const captchaRes = await axios({
      method: "post",
      url: "https://www.google.com/recaptcha/api/siteverify",
      data: qs.stringify({
        secret: process.env.CAPTCHA_SECRET_KEY,
        response: req.body.captcha
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8"
      }
    });
    if (!captchaRes.data.success) throw new Error("Could not authenticate captcha");
}

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
        res.json({ token: token, _id: user._id, role: user.role });
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

router.post("/forgot_password", function (req, res) {
  try {
    validateCaptcha(req);
    userService.forgotPassword(req.body, (err, token) => {
    if (err) return res.json({ error: err.message });
    res.json({ token });
  });
  } catch (error) {
        return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ error: "Could not authenticate captcha" });
  }
});

router.post("/update_password", function(req, res) {
  userService.updatePassword(req.body, err => {
    if (err) return res.json({ error: err.message });
    res.json({ status: true });
  });
});

router.post("/requests", async function(req, res) {
  try {
     validateCaptcha(req);
    const status = await userService.createRequest(
      req.body.email,
      req.body.text
    );
    res.json(status);
  } catch (error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: error.message });
  }
});

router.get("/verify-email", function(req, res) {
  const token = req.query.token;
  if (!token)
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .send("Request cannot be authenticated");
  try {
    userService.verifyEmailToken(token);
    res.send("Congratulations, Your Email Address has successfully verified..");
  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send("There was an error whiles processing your request");
  }
});

module.exports = router;
