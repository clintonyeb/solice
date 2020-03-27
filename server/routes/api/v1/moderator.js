const jwt = require("express-jwt");
var express = require("express");
var router = express.Router();
var userService = require("../../../services").users;
const authorize = require("../../../utils/roleware");
const ROLES = require("../../../utils/user-roles");

// JWT validation error handler
// router.use(
//   jwt({
//     secret: process.env["SECRET_KEY"]
//   })
// );

// router.use(authorize(ROLES.MODERATOR));

/* GET users listing. */
router.get("/moderator", function(req, res, next) {
  db.getAll((err, users) => {
    res.render("user/list", {
      title: req.app.conf.name,
      list: users
    });
  });
});

router.get("/moderator/:username", function(req, res, next) {
  db.findOne({ username: req.params.username }, (err, user) => {
    if (!user) return res.status(404).send("No user found");
    user.bio = textParser(user.bio);
    res.render("user/profile", {
      title: req.app.conf.name,
      user: user,
      userId: req.session._id
    });
  });
});

module.exports = router;
