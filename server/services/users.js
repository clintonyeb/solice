var User = require("../models/users");
var bcrypt = require("bcrypt-nodejs");
const a = require("array-tools");
const _ = require("lodash/_arrayIncludes");

function checkSpace(name) {
  var charSplit = name.split("");
  //console.log(charSplit)
  return _(charSplit, " ");
}

function createNew(obj, cb) {
  if (checkSpace(obj.username)) {
    return cb(new Error("Invalid username provided"));
  } else {
    User.findOne({ username: obj.username }).exec((err, user) => {
      if (user) {
        return cb(new Error("User with username already exists"));
      } else {
        var bio = `Hey there! I'm ${obj.firstname} ;)! Wish me on ${obj.dob.day} ${obj.dob.month}`;
        var newUser = new User({
          username: obj.username,
          firstname: obj.firstname,
          lastname: obj.lastname,
          dob: obj.dob,
          bio: bio,
          profile_pic: "/images/logo/logo.png",
          posts: [],
          followers: [],
          lastLogin: new Date(),
          password: obj.password
        });
        newUser.save((err, res) => {
          return cb(err, res);
        });
      }
    });
  }
}

function authenticate(obj, cb) {
  User.findOne({ username: obj.username }).exec((err, user) => {
    if (err) return cb(new Error("Invalid username and password"));
    if (user && user.validPassword(obj.password)) {
      cb(null, user);
    } else {
      cb(new Error("Invalid username and password"));
    }
  });
}

function findOne(obj, cb) {
  User.findOne(obj).exec((err, user) => {
    if (err) return cb(err, false);
    if (user) {
      return cb(err, user);
    } else {
      return cb(null, false);
    }
  });
}

function forgotPassword(obj, cb) {
  findOne(obj, (err, user) => {
    if (err) return err;
    const token = user.generateToken();
    cb(null, token);
  })
}

function updatePassword(obj, cb) {
  findOne(obj, (err, user) => {
    if (err) return err;
    if (user.token != obj.token) return new Error("Cannot change password, invalid token");
    user.save(cb)
  });
}

function search(opt, cb) {
  User.find({ username: { $gt: opt } }).exec((err, results) => {
    if (err) return cb(err, false);
    if (results) {
      return cb(err, results);
    } else {
      return cb(null, false);
    }
  });
}

function getAll(cb) {
  User.find({}).exec((err, users) => {
    if (err) return cb(err, false);
    if (users) {
      return cb(null, users);
    } else {
      return cb(null, false);
    }
  });
}

function deleteOne(opt, cb) {
  //if(typeof opt !== Object) cb("Must be a javascript object.");
  User.deleteOne(opt).exec((err, res) => {
    if (err) return cb(err, null);
    else if (res.n == 0) {
      return cb(null, true);
    }
  });
}
function comment(user, comment, _id, cb) {
  User.findOne(user).exec((err, obj) => {
    if (!obj) return cb("Does not exist.", null);
    for (var i = 0; i < obj.posts.length; i++) {
      if (obj.posts[i]._id == _id) {
        obj.posts[i].comments.push(comment);
        obj.notifications.push({
          msg: `@${comment.by} reacted to your post.`,
          link: `/u/${comment.by}`,
          time: new Date()
        });
        obj = new User(obj);
        obj.save((err, res) => {
          return cb(err, res);
        });
      }
    }
  });
}
function like(user, like, _id, cb) {
  console.log(user);
  User.findOne(user).exec((err, obj) => {
    if (!obj) return cb("Does not exist.", null);
    //console.log(obj);
    for (var i = 0; i < obj.posts.length; i++) {
      if (obj.posts[i]._id == _id) {
        obj.posts[i].likes.push(like.by);
        obj.notifications.push({
          msg: `@${like.by} liked your post.`,
          link: `/u/${like.by}`,
          time: new Date()
        });
        obj = new User(obj);
        obj.save(err => {
          cb(err, true);
        });
      }
    }
  });
}

// Expose all the api...
module.exports = {
  createNew: createNew,
  authenticate: authenticate,
  findOne: findOne,
  getAll: getAll,
  comment: comment,
  like: like,
  search: search
};
