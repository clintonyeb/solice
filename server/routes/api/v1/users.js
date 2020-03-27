const jwt = require("express-jwt");
var express = require("express");
var router = express.Router();
var userService = require("../../../services").users;
const authorize = require("../../../utils/roleware");
const ROLES = require("../../../utils/user-roles");

// JWT validation error handler
router.use(
  jwt({
    secret: process.env["SECRET_KEY"]
  })
);

router.use(authorize(ROLES.USER));

router.get("/:username", function(req, res) {
  db.findOne({ username: req.params.username }, (err, user) => {
    if (!user) return res.status(404).send("No user found");
    res.json(user);
  });
});

router.get("/settings", function(req, res, next) {
  db.findOne({ _id: req.session._id }, (err, user) => {
    res.render("me/settings", {
      title: req.app.conf.name,
      user: user
    });
  });
});

router.post("/v1/comment", function(req, res, next) {
  db.comment(
    { username: req.body.author },
    { by: req.session.user, text: req.body.text },
    req.body._id,
    (err, result) => {
      if (result) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
});

router.post("/v1/like", function(req, res, next) {
  //console.log(req.body);
  db.like(
    { username: req.body.author },
    { by: req.session.user },
    req.body._id,
    (err, result) => {
      if (result) {
        res.send({ event: true, msg: "Liked!" });
        //	console.log(result)
      } else {
        res.send({ event: false, msg: "Already liked." });
      }
    }
  );
});

router.post("/v1/follow", function(req, res, next) {
  db.findOne(req.body, (err, user) => {
    var disabled = false;
    for (var i = 0; i < user.followers.length; i++) {
      if (user.followers[i] == req.session._id) {
        console.log(i);
        return (disabled = true);
      }
    }
    if (disabled) {
      res.status(200).send("disabled");
    } else {
      user.followers.push(req.session._id);
      user.notifications.push({
        msg: `${req.session.user} started following you.`,
        link: `/u/${req.session.user}`,
        time: new Date()
      });
      user = User(user);
      user.save(err => {
        res.status(200).send("done");
      });
    }
  });
});

router.post("/v1/user/:mode", function(req, res, next) {
  if (!req.session.user) return res.sendStatus(404);
  if (req.params.mode == "picture") {
    db.findOne({ _id: req.query.id }, (err, user) => {
      if (!user) return res.sendStatus(404);
      var image_types = ["png", "jpeg", "gif", "jpg"];
      var form = new formidable.IncomingForm();

      form.parse(req);

      form.on("fileBegin", function(name, file) {
        if (!image_types.includes(file.name.split(".")[1].toLowerCase())) {
          return res.status(404).send("Unsupported file type!");
        }
        if (
          fs.existsSync(
            __dirname.split("/routes")[0] +
              "/public/images/profile_pictures/" +
              user.username +
              "." +
              file.name.split(".")[1]
          )
        ) {
          fs.unlinkSync(
            __dirname.split("/routes")[0] +
              "/public/images/profile_pictures/" +
              user.username +
              "." +
              file.name.split(".")[1]
          );
        }
        file.path =
          __dirname.split("/routes")[0] +
          "/public/images/profile_pictures/" +
          user.username +
          "." +
          file.name.split(".")[1];
      });

      form.on("file", function(name, file) {
        if (!image_types.includes(file.name.split(".")[1].toLowerCase())) {
          return;
        }
        user["profile_pic"] =
          "/images/profile_pictures/" +
          user.username +
          "." +
          file.name.split(".")[1];
        user.save((err, profile) => {
          delete req.session.user;
          req.session.user = profile.username;
          req.session._id = profile._id;
          res
            .status(200)
            .send(
              "/images/profile_pictures/" +
                user.username +
                "." +
                file.name.split(".")[1]
            );
        });
      });
      return;
    });
    return;
  }
  db.findOne({ _id: req.body._id }, (err, user) => {
    if (err) return res.end(err);
    if (!user) return res.sendStatus(404);

    user[req.body.key] = req.body.value;
    /*user.save(function(err) {
			if(err) console.error(err);
			return res.sendStatus(200);
		})*/
    user.save((err, profile) => {
      delete req.session.user;
      req.session.user = profile.username;
      req.session._id = profile._id;
      res.status(200).send("done");
    });
  });
});

router.get("/v1/search", function(req, res, next) {
  var regx = "^" + req.query.q + ".*";
  User.find({
    $or: [
      { username: { $regex: regx } },
      { firstname: { $regex: regx } },
      { lastname: { $regex: regx } }
    ]
  }).exec((err, all) => {
    return res.send(all);
  });
});

router.get("/v1/oauth/:service", function(req, res, next) {
  if (req.params.service == "instagram") res.redirect(ig.auth_url);
  if (req.params.service == "google") res.redirect(g.auth_url);
});

router.get("/v1/notifications", function(req, res, next) {
  User.findOne({ _id: req.session._id }).exec((err, userData) => {
    res.send(new String(userData.notifications.length));
  });
});

router.post("/v1/notifications/markAsRead", function(req, res, next) {
  User.findOne({ _id: req.session._id }).exec((err, userData) => {
    userData.notifications = [];
    userData.save((err, response) => {
      res.redirect("/me/activity");
    });
  });
});

router.get("/activity", function(req, res, next) {
  db.findOne({ _id: req.session._id }, (err, user) => {
    res.render("me/activity", {
      title: req.app.conf.name,
      activity: user.notifications
    });
  });
});

router.get("/post/:action/:query", function(req, res, next) {
  switch (req.params.action) {
    case "edit":
      res.render("index");
      break;
    case "delete":
      {
        db.findOne({ username: req.session.user }, (err, u) => {
          let id = req.params.query;
          console.log(u);
          if (
            u.posts[u.posts.indexOf(u.posts.find(x => x._id == id))].static_url
          )
            fs.unlinkSync(
              "./public" +
                u.posts[u.posts.indexOf(u.posts.find(x => x._id == id))]
                  .static_url
            );
          u.posts.splice(u.posts.indexOf(u.posts.find(x => x._id == id)), 1);
          u.save(err => {
            if (err) throw err;
            console.log("Post deleted");
            res.redirect("/");
          });
        });
      }
      break;
    default:
      res.send("hi");
  }
});

router.get("/upload", function(req, res, next) {
  res.render("upload/file-upload", {
    title: req.app.conf.name,
    user: req.session.user
  });
});

router.post("/upload", function(req, res, next) {
  // Generate a random id
  var random_id = guid.raw();
  if (req.files.filetoupload.name) {
    // Assign static_url path
    var oldpath = req.files.filetoupload.path;
    var newpath = path.join(
      __dirname,
      `../public/feeds/${req.session.user}_${random_id}${req.files.filetoupload.name}`
    );
    var final_location = `/feeds/${req.session.user}_${random_id}${req.files.filetoupload.name}`;

    console.log(
      `${oldpath} - OldPath\n ${newpath} - Newpath\n ${final_location} - DiskLocation\n`
    );
    // Finally upload the file to disk and save the feed to users profile.
    var type = mime.lookup(req.files.filetoupload.name).split("/")[1];
    mv(oldpath, newpath, function(err) {
      console.log("moving files");
    });
  } else {
    final_location = null;
  }
  db.findOne({ username: req.session.user }, (err, u) => {
    console.log(u);
    u.posts.push({
      _id: random_id,
      author: req.session.user,
      authorID: req.session._id,
      static_url: final_location,
      caption: req.body.caption,
      category: req.body.type,
      comments: [],
      likes: [],
      type: type,
      createdAt: new Date(),
      lastEditedAt: new Date()
    });
    u.save(err => {
      if (err) throw err;
      console.log("Post saved");
      // Redirect back after the job is done.
      res.redirect("/");
    });
  });
});

router.get("/:category", function(req, res, next) {
  db.getAll((err, users) => {
    res.render("category", {
      title: req.app.conf.name,
      people: users,
      category: req.params.category
    });
  });
});

router.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json("Invalid token received with request...");
  }
});

module.exports = router;
