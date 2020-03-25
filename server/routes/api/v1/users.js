var express = require("express");
var router = express.Router();
var services = require("../../../services");

router.post("/signup", function(req, res, next) {
  services.users.createNew(req.body, (err, data) => {
    if (err) {
      return res.status(422).json({
        error: err.message
      });
    }
    res.json(data);
  });
});

router.post("/login", function(req, res, next) {
  services.users.authenticate(req.body, (err, user) => {
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

router.get("/logout", function(req, res, next) {
  req.session.destroy(() => {
    res.redirect("/?action=logout");
  });
});

module.exports = router;
