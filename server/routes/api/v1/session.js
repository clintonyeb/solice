var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
const handlers = require("../../../handlers/session");

router.post("/signup", handlers.signUp);

router.post("/login", handlers.login);

router.get(
  "/logout",
  jwt({ secret: process.env["SECRET_KEY"], credentialsRequired: false }),
  handlers.logout
);

router.post("/forgot_password", handlers.forgotPassword);

router.post("/update_password", handlers.updatePassword);

router.post("/requests", handlers.requests);

router.get("/verify-email", handlers.verifyEmail);

module.exports = router;
