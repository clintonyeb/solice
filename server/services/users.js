var User = require("../models/users");
var Post = require("../models/posts");
var Word = require("../models/words");
var Ad = require("../models/ads");
const jwt = require("jsonwebtoken");
const POST_STATUS = require("../utils/post-status");
const email = require("../services/email");
const TYPES = require("../utils/noti-types");
const notiService = require("./noti");
const WebSocket = require("ws");
const ObjectId = require("mongoose").Types.ObjectId;

const LIMIT = 10;

// helpers
async function _getPostStatus(text) {
  const t = await Word.findOne({ $text: { $search: text } });
  return t;
}

// functions

function authenticate(obj, cb) {
  User.findOne({ email: obj.email }).exec((err, user) => {
    if (err) return cb(new Error("Invalid username and password"));
    if (user && user.validPassword(obj.password)) {
      if (user.status === 0) {
        return cb(null, user);
      } else if (user.status === 1) {
        return cb(new Error("Your Account has been suspended"));
      } else {
        return cb(
          new Error(
            "Please confirm your email address. We have sent you an email with instructions"
          )
        );
      }
    } else {
      return cb(new Error("Invalid username and password"));
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
      return cb(err, user[type]);
    });
}

function getAllUsers(user, cb) {
  User.find({ _id: { $ne: user }, status: 0 }, (err, users) => {
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
    const subscriptions = user.subscriptions;
    subscriptions.push(userId); // include self
    Post.find({ postedBy: { $in: subscriptions }, status: 0 })
      .populate("postedBy")
      .sort({ created: "desc" })
      .skip(LIMIT * page - LIMIT)
      .limit(LIMIT)
      .exec((err, posts) => {
        return cb(err, posts);
      });
  });
}

async function getPost(id) {
  const post = await Post.findById(id).populate("postedBy").exec();
  return post;
}

async function createPost(post) {
  const res = await _getPostStatus(post.text);
  if (res) {
    post.status = POST_STATUS.DISABLED;
  } else {
    post.status = POST_STATUS.ENABLED;
  }
  const newPost = await new Post(post).save();
  const _post = await getPost(newPost._id);
  return _post;
}

function createUser(obj, cb) {
  User.findOne({ email: obj.email }, (err, user) => {
    if (user) {
      return cb(new Error("User with username already exists"));
    }
    let bio = `Hey there! I'm ${obj.firstname}`;
    var newUser = new User({
      email: obj.email,
      firstname: obj.firstname,
      lastname: obj.lastname,
      dob: obj.dob,
      bio: bio,
      profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
      password: obj.password,
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
async function followUser(userId, otherId, cb) {
  await User.updateOne(
    { _id: userId },
    {
      $addToSet: { subscriptions: otherId },
    }
  );
  const other = await User.findByIdAndUpdate(
    otherId,
    {
      $addToSet: { subscribers: userId },
    },
    { new: true }
  );
  return other;
}

async function unFollowUser(userId, otherId, cb) {
  await User.updateOne(
    { _id: userId },
    {
      $pull: { subscriptions: otherId },
    }
  );
  const other = await User.findByIdAndUpdate(
    otherId,
    {
      $pull: { subscribers: userId },
    },
    { new: true }
  );
  return other;
}

// TODO: sort by textscore
function searchUsers(userId, query, cb, page) {
  User.find(
    {
      _id: { $ne: userId },
      status: 0,
      $or: [
        { firstname: { $regex: query, $options: "i" } },
        { lastname: { $regex: query, $options: "i" } },
      ],
    },
    (err, users) => {
      if (err) return cb(err, false);
      return cb(err, users);
    }
  );
}

function searchUsersByType(userId, type, query, cb, page) {
  User.findById(userId, (err, user) => {
    User.find(
      {
        _id: { $in: user[type] },
        status: 0,
        $or: [
          { firstname: { $regex: query, $options: "i" } },
          { lastname: { $regex: query, $options: "i" } },
        ],
      },
      (err, users) => {
        if (err) return cb(err, false);
        return cb(err, users);
      }
    );
  });
}

function searchPosts(userId, query, cb) {
  Post.find({ postedBy: userId, text: { $regex: query, $options: "i" } })
    .populate("postedBy")
    .sort({ created: "desc" })
    .limit(LIMIT)
    .exec((err, posts) => {
      return cb(err, posts);
    });
}

function searchFeed(userId, query, cb, page) {
  page = page || 1;
  User.findById(userId, (err, user) => {
    if (err) return cb(err, false);
    const subscriptions = user.subscriptions;
    subscriptions.push(userId); // include self
    Post.find({
      postedBy: { $in: subscriptions },
      text: { $regex: query, $options: "i" },
      status: POST_STATUS.ENABLED,
    })
      .populate("postedBy")
      .sort({ created: "desc" })
      .skip(LIMIT * page - LIMIT)
      .limit(LIMIT)
      .exec((err, posts) => {
        return cb(err, posts);
      });
  });
}

async function likePost(userId, postId) {
  const _post = await Post.findOne({ _id: postId });
  let query = null;
  console.log(_post.likes, "likes");

  if (_post.likes.indexOf(userId) > -1) {
    query = { $pull: { likes: userId } };
  } else {
    query = { $addToSet: { likes: userId } };
  }
  const post = await Post.findByIdAndUpdate(postId, query, { new: true })
    .populate("postedBy")
    .populate({
      path: "comments.postedBy",
      model: "users",
    })
    .exec();
  return post;
}

async function commentPost(userId, postId, text) {
  const res = await _getPostStatus(text);
  if (res) {
    const noti = {
      type: TYPES.COMMENT_FLAGGED,
      postedBy: userId,
      targetPost: postId,
    };

    await User.updateOne({ _id: userId }, { $push: { notifications: noti } });
    await User.update({ role: 2 }, { $push: { notifications: noti } });
    throw new Error("Comment flagged as containing sensitive words");
  }
  const comment = {
    text: text,
    postedBy: userId,
  };

  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("postedBy")
    .populate({
      path: "comments.postedBy",
      model: "users",
    })
    .exec();
  return post;
}

function deleteComment(postId, commentId, cb) {
  Post.update(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } },
    (err) => {
      Post.findById(postId)
        .populate("postedBy")
        .populate({
          path: "comments.postedBy",
          model: "users",
        })
        .exec((err, post) => {
          if (err) return cb(err);
          return cb(err, post);
        });
    }
  );
}

function getComments(postId, cb) {
  Post.findById(postId)
    .populate({
      path: "comments.postedBy",
      model: "users",
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
  const user = await User.findById(userId);
  const res = await user.update(data);
  return res;
}

async function getNotifications(userId) {
  const notifications = await User.aggregate([
    { $match: { _id: new ObjectId(userId) } },
    { $unwind: "$notifications" },
    { $replaceRoot: { newRoot: "$notifications" } },
    { $sort: { created: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "postedBy",
        foreignField: "_id",
        as: "postedBy",
      },
    },
    { $unwind: "$postedBy" },
    {
      $project: {
        "postedBy.notifications": 0,
        "postedBy.password": 0,
        "postedBy.requests": 0,
      },
    },
  ]);

  return notifications;
}

async function clearNotifications(userId) {
  await User.updateMany(
    { _id: userId },
    { $set: { "notifications.$[].status": false } }
  );
}

async function getActiveUsersSubscribed(app, userId) {
  const user = await User.findById(userId);
  const active = user.subscriptions.filter((ff) =>
    app.locals.activeUsers.hasOwnProperty(ff)
  );
  const users = await User.find({ _id: { $in: active } });
  return users;
}

async function createRequest(username, text) {
  // find user by username
  // if not error
  const user = await User.findOne({
    email: username,
  });

  if (!user) {
    throw new Error("No user with email address found in our records");
  }
  // check if user is disabled
  // else error
  if (user.status === 0) {
    throw new Error("You account has not been disabled");
  }

  // check if user does not have pending requests
  // else error
  const found = user.requests.find((r) => r.status === 0);
  if (found) {
    throw new Error("You already have pending requests");
  }

  const request = {
    text: text,
    status: 0,
  };

  // created and add request
  await User.updateOne(
    { _id: user._id },
    {
      $push: { requests: request },
    }
  );

  return true;
}

async function getAds(userId) {
  const user = await User.findOne({ _id: userId });
  let ad = null;

  if (user.dob) {
    const age = computeAge(user.dob);
    const matchedAds = await Ad.find({ "targets.field": "age" })
      .sort({ created: "desc" })
      .exec();

    if (matchedAds) {
      ad = matchedAds.find((ad) => {
        return ad.targets.find((req) => {
          const value = Number(req.value);
          if (req.operator == "==" && age == value) return true;
          if (req.operator == "<" && age < value) return true;
          if (req.operator == ">" && age > value) return true;
          if (req.operator == "!=" && age != value) return true;
          return false;
        });
      });
    }
  }

  if (!ad) {
    ad = await Ad.findOne().sort({ created: "desc" }).exec();
  }

  return ad;
}

function computeAge(dob) {
  const now = new Date();
  return now.getFullYear() - dob.year;
}

async function verifyEmailToken(token) {
  const user = jwt.verify(token, process.env.SECRET_KEY);
  const data = await User.findByIdAndUpdate(user._id, { status: 0 });
  email.sendUserWelcome(data);
}

async function runCronJob() {
  const users = await User.aggregate([
    { $match: { "notifications.status": true } },
    { $project: {notifications: 1, firstname: 1, lastname: 1, email: 1}},
    { $addFields: { notifications: { $size: "$notifications" } } },
    { $match: { notifications: { $gte: 4 } } },
  ]);

  users.forEach((user) => {
    email.sendUserNotification(user);
  });
}

async function forgotPassword(_email) {
  const user = await User.findOne({ email: _email });
  if (!user) throw new Error("User record not found");
  user.generateToken(async (err, token) => {
    email.sendRecoverPasswordEmail(user, token);
  });
}

async function resetPassword(token, password) {
  const user = jwt.verify(token, process.env.SECRET_KEY);
  const data = await User.findByIdAndUpdate(
    user._id,
    { password: password },
    { new: true }
  );
  email.sendPasswordChangeEmail(data);
}

async function notifyUser(app, userId, noti) {
  if (_isOnline(app, userId)) {
    notiService.sendToUser(app, userId, noti);
  }
  await User.updateOne(
    { _id: userId },
    {
      $push: { notifications: noti },
    }
  );
}

async function notifyAdmins(noti) {
  await User.updateMany({ role: 2 }, { $push: { notifications: noti } });
}

function _isOnline(app, id) {
  const ws = app.locals.activeUsers[id];
  return ws && ws.readyState === WebSocket.OPEN;
}

async function broadCastUserJoin(activeUsers, userId) {
  const user = await User.findById(userId);
  const data = JSON.stringify({ type: "user-online", data: user });
  broadCastUser(activeUsers, user, data);
}

async function broadCastUserLeave(activeUsers, userId) {
  const user = await User.findById(userId);
  const data = JSON.stringify({ type: "user-offline", data: userId });
  broadCastUser(activeUsers, user, data);
}

async function broadCastUser(activeUsers, user, data) {
  user.subscribers
    .filter((ff) => activeUsers.hasOwnProperty(ff))
    .forEach((u) => {
      const ws = activeUsers[u];
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
}

async function deletePost(postId) {
  await Post.deleteOne({ _id: postId });
}

module.exports = {
  deletePost,
  createUser,
  authenticate,
  getUser,
  createPost,
  getPosts,
  getAllUsers,
  followUser,
  unFollowUser,
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
  clearNotifications,
  getActiveUsersSubscribed,
  createRequest,
  getAds,
  verifyEmailToken,
  runCronJob,
  forgotPassword,
  resetPassword,
  notifyUser,
  notifyAdmins,
  searchUsersByType,
  broadCastUserJoin,
  broadCastUserLeave,
  getPostForId: getPost,
};
