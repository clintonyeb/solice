var User = require("../models/users");
var Post = require("../models/posts");
const TYPES = require("../utils/noti-types");
const WebSocket = require("ws");

async function newPost(app, userId, postId) {
  const not = {
    type: TYPES.NEW_POST,
    postedBy: userId,
    targetPost: postId,
    created: Date.now(),
    status: true,
  };

  _updateFollowers(app, userId, not);
}

async function likedPost(app, userId, postId) {
  const not = {
    type: TYPES.LIKE_POST,
    postedBy: userId,
    targetPost: postId,
    created: Date.now(),
    status: true,
  };

  _updateFollowers(app, userId, not);
}

async function commentedPost(app, userId, postId) {
  const not = {
    type: TYPES.COMMENT_POST,
    postedBy: userId,
    targetPost: postId,
    created: Date.now(),
    status: true,
  };

  _updateFollowers(app, userId, not);
}

async function followedUser(app, userId, targetId) {
  const not = {
    type: TYPES.FOLLOWED_USER,
    postedBy: userId,
    targetUser: targetId,
    created: Date.now(),
    status: true,
  };

  _updateFollowers(app, userId, not);
}

async function updatedProfile(app, userId) {
  const not = {
    type: TYPES.UPDATED_PROFILE,
    postedBy: userId,
    targetUser: userId,
    created: Date.now(),
    status: true,
  };

  _updateFollowers(app, userId, not);
}

async function online(app, userId) {
  const not = {
    type: TYPES.ONLINE,
    postedBy: userId,
    targetUser: userId,
    created: Date.now(),
    status: true,
  };

  _updateFollowers(app, userId, not);
}

async function _updateFollowers(app, userId, noti) {
  const user = await User.findById(userId);

  user.subscribers.forEach(async (ff) => {
    if (isOnline(app, ff)) {
      sendToUser(app, ff, noti);
    }
    await User.updateOne({ _id: ff }, { $push: { notifications: noti } });
  });
}

function isOnline(app, id) {
  const ws = app.locals.activeUsers[id];
  return ws && ws.readyState === WebSocket.OPEN;
}

async function sendToUser(app, id, noti) {
  const user = await User.findById(noti.postedBy);
  noti.postedBy = user;
  const data = { type: "notifications", data: noti };
  return app.locals.activeUsers[id].send(JSON.stringify(data));
}

module.exports = {
  newPost,
  likedPost,
  commentedPost,
  followedUser,
  updatedProfile,
  online,
  sendToUser,
};
