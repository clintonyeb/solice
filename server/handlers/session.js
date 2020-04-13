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
          message: err.message
        });
      }
      res.json(data);

      data.generateToken((err, token) => {
        const url = req.protocol + "://" + req.headers.host + "/api/v1";
        email.sendEmailVerification(data, url, token);
      });
    });
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
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
  if (captchaRes.data.success !== true)
    throw new Error("Could not authenticate captcha");
}

function login(req, res) {
  userService.authenticate(req.body, (err, user) => {
    if (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: err.message
      });
    }

    user.generateToken((err, token) => {
      if (err) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: err.message
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
    await userService.forgotPassword(req.body.email);
    res.json({ status: true });
  } catch (error) {
    return res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: error.message });
  }
}

async function resetPassword(req, res) {
  try {
    await userService.resetPassword(
      req.body.token,
      req.body.password
    );
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: error.message });
  }
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
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: error.message });
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
      .send({ message: "There was an error whiles processing your request" });
  }
}

module.exports = {
  signUp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  requests,
  verifyEmail
};
