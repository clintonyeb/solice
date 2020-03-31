var User = require("../models/users");
var Post = require("../models/posts");
var Comment = require("../models/comments");
// const _ = require("lodash/_arrayIncludes");

const error = new Error("Record not found...");

const LIMIT = 10;

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
    return cb(err, user);
  });
}

function getUserFull(id, type, cb) {
  User.findById(id)
    .populate(type)
    .exec((err, user) => {
      if (err) return cb(err, false);
      return cb(err, user);
    });
}

function getAllUsers(user, cb) {
  User.find({ role: 0, _id: { $ne: user } }, (err, users) => {
    if (err) return cb(err, false);
    return cb(err, users);
  });
}

function getPosts(userId, cb) {
  Post.find({ postedBy: userId })
    .populate("postedBy")
    .sort({ created: "desc" })
    .limit(LIMIT)
    .exec((err, posts) => {
      return cb(err, posts);
    });
}

function getFeed(userId, cb, page) {
  page = page || 1;
  User.findById(userId, (err, user) => {
    if (err) return cb(err, false);
    const following = user.following;
    following.push(userId); // include self
    Post.find({ postedBy: { $in: following } })
      .populate("postedBy")
      .sort({ created: "desc" })
      .skip(LIMIT * page - LIMIT)
      .limit(LIMIT)
      .exec((err, posts) => {
        return cb(err, posts);
      });
  });
}

function getPost(id, cb) {
  Post.findById(id)
    .populate("postedBy")
    .exec((err, post) => {
      console.log(err, post);
      if (err) return cb(err);
      return cb(err, post);
    });
}

function createPost(post, cb) {
  var newPost = new Post(post);
  newPost.save((err, res) => {
    if (err) return err;
    return getPost(res._id, cb);
  });
}

// function checkSpace(name) {
//   var charSplit = name.split("");
//   //console.log(charSplit)
//   return _(charSplit, " ");
// }

function createUser(obj, cb) {
  // if (checkSpace(obj.username)) {
  //   return cb(new Error("Invalid username provided"));
  // }

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
      profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
      password: obj.password
    });

    newUser.save((err, res) => {
      return cb(err, res);
    });
  });
}

/**
 *
 * @param {String} userId current user id
 * @param {String} otherId other user id
 * @param {Function} cb callback function
 */
function follow(userId, otherId, cb) {
  User.findById(userId, (err, user) => {
    if (err) return cb(err, false);
    User.findById(otherId, (err, other) => {
      if (err) return cb(err, false);
      user.following.push(other._id);
      other.followers.push(user._id);
      user.save(err => other.save(err => cb(err, other)));
    });
  });
}

function unfollow(userId, otherId, cb) {
  User.findById(userId, (err, user) => {
    if (err) return cb(err, false);
    User.findById(otherId, (err, other) => {
      if (err) return cb(err, false);
      const uI = user.following.findIndex(d => d === otherId);
      const oI = user.followers.findIndex(d => d === userId);
      user.following.splice(uI, 1);
      other.followers.splice(oI, 1);
      user.save(err => other.save(err => cb(err, other)));
    });
  });
}

// sort by textscore
function searchUsers(userId, query, cb, page) {
  User.find(
    {
      role: 0,
      _id: { $ne: userId },
      $text: { $search: query }
    },
    (err, users) => {
      if (err) return cb(err, false);
      return cb(err, users);
    }
  );
}

function searchPosts(userId, query, cb) {
  User.findById(userId, (err, user) => {
    if (err) return cb(err, false);
    const following = user.following;
    following.push(userId); // include self
    Post.find({ postedBy: { $in: following } })
      .populate("postedBy")
      .sort({ created: "desc" })
      .limit(LIMIT)
      .exec((err, posts) => {
        return cb(err, posts);
      });
  });
}

function searchFeed(userId, query, cb, page) {
  page = page || 1;
  User.findById(userId, (err, user) => {
    if (err) return cb(err, false);
    const following = user.following;
    following.push(userId); // include self
    Post.find({ postedBy: { $in: following }, $text: { $search: query } })
      .populate("postedBy")
      .sort({ created: "desc" })
      .skip(LIMIT * page - LIMIT)
      .limit(LIMIT)
      .exec((err, posts) => {
        return cb(err, posts);
      });
  });
}

function likePost(userId, postId, cb) {
  getPost(postId, (err, post) => {
    if (err) return cb(err);
    const f = post.likes.indexOf(userId);
    if (f > -1) {
      post.likes.splice(f, 1);
    } else {
      post.likes.push(userId);
    }

    post.save(err => cb(err, post));
  });
}

async function commentPost(userId, postId, text, cb) {
  getPost(postId, async (err, post) => {
    if (err) return cb(err);

    const comment = await new Comment({
      text: text,
      postedBy: userId
    }).save();

    post.comments.push(comment._id);

    post.save(err => {
      Post.findById(post._id)
        .populate("postedBy")
        .populate({
          path: "comments",
          populate: {
            path: "postedBy",
            model: "users"
          }
        })
        .exec((err, post) => {
          if (err) return cb(err);
          return cb(err, post);
        });
    });
  });
}

function deleteComment(postId, commentId, cb) {
  Post.update({ _id: postId }, { $pull: { comments: commentId } }, err => {
    Post.findById(postId)
      .populate("postedBy")
      .populate({
        path: "comments",
        populate: {
          path: "postedBy",
          model: "users"
        }
      })
      .exec((err, post) => {
        if (err) return cb(err);
        return cb(err, post);
      });
  });
}

function getComments(postId, cb) {
  Post.findById(postId)
    .populate({
      path: "comments",
      populate: {
        path: "postedBy",
        model: "users"
      }
    })
    .exec((err, post) => {
      if (err) return cb(err);
      return cb(err, post.comments);
    });
}

async function logout(userId) {
  // const user = await User.findById(userId);
  // const res = await user.update({ token: null });
  return true;
}

async function updateUser(userId, data) {
  delete data["_id"];
  const user = await User.findById(userId);
  const res = await user.update(data);
  return res;
}

async function getNotifications(userId) {
  const user = await User.findById(userId)
    .populate({
      path: "notifications.postedBy",
      model: "users"
    })
    .populate({
      path: "notifications.targetUser",
      model: "users"
    })
    .populate({
      path: "notifications.targetPost",
      model: "posts"
    })
    .sort({ created: "desc" })
    .limit(LIMIT)
    .exec();

  return user.notifications;
}

async function deleteNotifications(userId) {
  await User.updateOne({ _id: userId }, { $set: { notifications: [] } });
}

async function getActiveFollowing(app, userId) {
  const user = await User.findById(userId);
  const active = user.following.filter(ff =>
    app.locals.activeUsers.hasOwnProperty(ff)
  );
  const users = await User.find({ _id: { $in: active } });
  return users;
}

// Expose all the api...
module.exports = {
  createUser,
  authenticate,
  getUser,
  createPost,
  getPosts,
  getAllUsers,
  follow,
  unfollow,
  getUserFull,
  getFeed,
  searchPosts,
  searchUsers,
  searchFeed,
  likePost,
  getComments,
  commentPost,
  deleteComment,
  updateUser,
  getNotifications,
  logout,
  deleteNotifications,
  getActiveFollowing
};
