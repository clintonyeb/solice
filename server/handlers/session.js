var userService = require("../services").users;
var HttpStatus = require("http-status-codes");
const email = require("../services/email");
const axios = require("axios");
const qs = require("qs");
const User = require("../models/users");

async function signUp(req, res) {
  try {
    await validateCaptcha(req);
    userService.createUser(req.body, (err, data) => {
      if (err) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          error: err.message
        });
      }
      res.json(data);

      User.generateToken((err, token) => {
        const url = req.protocol + "://" + req.headers.host + "/api/v1";
        email.sendEmailVerification(data, url, token);
      });
    });
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
  }
}

async function validateCaptcha(req) {
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
  if (!captchaRes.data.success)
    throw new Error("Could not authenticate captcha");
}

function login(req, res) {
  userService.authenticate(req.body, (err, user) => {
    if (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: err.message
      });
    }

    User.generateToken((err, token) => {
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
}

async function logout(req, res) {
  const user = await userService.logout(req.user._id);
  res.json(user);
}

async function forgotPassword(req, res) {
  try {
    await validateCaptcha(req);
    userService.forgotPassword(req.body, (err, token) => {
      if (err) return res.json({ error: err.message });
      res.json({ token });
    });
  } catch (error) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ error: "Could not authenticate captcha" });
  }
}

function updatePassword(req, res) {
  userService.updatePassword(req.body, err => {
    if (err) return res.json({ error: err.message });
    res.json({ status: true });
  });
}

async function requests(req, res) {
  try {
    await validateCaptcha(req);
    const status = await userService.createRequest(
      req.body.email,
      req.body.text
    );
    res.json(status);
  } catch (error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ error: error.message });
  }
}

function verifyEmail(req, res) {
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
}

module.exports = {
  signUp,
  login,
  logout,
  forgotPassword,
  updatePassword,
  requests,
  verifyEmail
};
