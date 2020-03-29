var User = require("../models/users");
var Post = require("../models/posts");
// const a = require("array-tools");
const _ = require("lodash/_arrayIncludes");

const error = new Error("Record not found...");

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

function getUser(id, cb) {
  User.findById(id, (err, user) => {
    if (err) return cb(err, false);
    if (user) {
      return cb(err, user);
    } else {
      return cb(error, false);
    }
  });
}

function getPosts(userId, cb) {
  Post.find({ postedBy: userId }, (err, posts) => {
    return cb(err, posts);
  });
}

function createPost(post, cb) {
  var newPost = new Post(post);
  newPost.save((err, res) => {
    return cb(err, res);
  });
}

function checkSpace(name) {
  var charSplit = name.split("");
  //console.log(charSplit)
  return _(charSplit, " ");
}

function createUser(obj, cb) {
  if (checkSpace(obj.username)) {
    console.log("herecscacacascas");
    return cb(new Error("Invalid username provided"));
  }
  console.log("mmsmsamdms");

  User.findOne({ username: obj.username }, (err, user) => {
    if (user) {
      return cb(new Error("User with username already exists"));
    }

    let bio = "";
    if (obj.dob) {
      bio = `Hey there! I'm ${obj.firstname} ;)! Wish me on ${obj.dob.day} ${obj.dob.month}`;
    } else {
      bio = `Hey there! I'm ${obj.firstname}`;
    }
    var newUser = new User({
      username: obj.username,
      firstname: obj.firstname,
      lastname: obj.lastname,
      dob: obj.dob,
      bio: bio,
      profile_pic: "/images/logo/logo.png",
      password: obj.password
    });
    console.log("here");

    newUser.save((err, res) => {
      return cb(err, res);
    });
  });
}

function forgotPassword(obj, cb) {
  findOne(obj, (err, user) => {
    if (err) return err;
    const token = user.generateToken();
    cb(null, token);
  });
}

function updatePassword(obj, cb) {
  findOne(obj, (err, user) => {
    if (err) return err;
    if (user.token != obj.token)
      return new Error("Cannot change password, invalid token");
    user.save(cb);
  });
}

// function search(opt, cb) {
//   User.find({ username: { $gt: opt } }).exec((err, results) => {
//     if (err) return cb(err, false);
//     if (results) {
//       return cb(err, results);
//     } else {
//       return cb(null, false);
//     }
//   });
// }

// function getAll(cb) {
//   User.find({}).exec((err, users) => {
//     if (err) return cb(err, false);
//     if (users) {
//       return cb(null, users);
//     } else {
//       return cb(null, false);
//     }
//   });
// }

// function deleteOne(opt, cb) {
//   //if(typeof opt !== Object) cb("Must be a javascript object.");
//   User.deleteOne(opt).exec((err, res) => {
//     if (err) return cb(err, null);
//     else if (res.n == 0) {
//       return cb(null, true);
//     }
//   });
// }
// function comment(user, comment, _id, cb) {
//   User.findOne(user).exec((err, obj) => {
//     if (!obj) return cb("Does not exist.", null);
//     for (var i = 0; i < obj.posts.length; i++) {
//       if (obj.posts[i]._id == _id) {
//         obj.posts[i].comments.push(comment);
//         obj.notifications.push({
//           msg: `@${comment.by} reacted to your post.`,
//           link: `/u/${comment.by}`,
//           time: new Date()
//         });
//         obj = new User(obj);
//         obj.save((err, res) => {
//           return cb(err, res);
//         });
//       }
//     }
//   });
// }
// function like(user, like, _id, cb) {
//   console.log(user);
//   User.findOne(user).exec((err, obj) => {
//     if (!obj) return cb("Does not exist.", null);
//     //console.log(obj);
//     for (var i = 0; i < obj.posts.length; i++) {
//       if (obj.posts[i]._id == _id) {
//         obj.posts[i].likes.push(like.by);
//         obj.notifications.push({
//           msg: `@${like.by} liked your post.`,
//           link: `/u/${like.by}`,
//           time: new Date()
//         });
//         obj = new User(obj);
//         obj.save(err => {
//           cb(err, true);
//         });
//       }
//     }
//   });
// }

// Expose all the api...
module.exports = {
  createUser,
  authenticate,
  getUser,
  createPost,
  getPosts
  // getAll: getAll,
  // comment: comment,
  // like: like,
  // search: search
};
