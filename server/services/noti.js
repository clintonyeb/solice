var Noti = require("../models/notifications");
var User = require("../models/users");
const TYPES = require("../utils/noti-types");

const error = new Error("Error creating notification...");

async function newPost(userId, postId) {
  const not = await new Noti({
    type: TYPES.NEW_POST,
    postedBy: userId,
    targetPost: postId
  }).save();

  _updateFollowers(userId, not);
}

async function likedPost(userId, postId) {
  const not = await new Noti({
    type: TYPES.LIKE_POST,
    postedBy: userId,
    targetPost: postId
  }).save();

  _updateFollowers(userId, not);
}

async function commentedPost(userId, postId) {
  const not = await new Noti({
    type: TYPES.COMMENT_POST,
    postedBy: userId,
    targetPost: postId
  }).save();

  _updateFollowers(userId, not);
}

async function followedUser(userId, targetId) {
  const not = await new Noti({
    type: TYPES.FOLLOWED_USER,
    postedBy: userId,
    targetUser: targetId
  }).save();

  _updateFollowers(userId, not);
}

async function updatedProfile(userId) {
  const not = await new Noti({
    type: TYPES.UPDATED_PROFILE,
    postedBy: userId
  }).save();

  _updateFollowers(userId, not);
}

async function online(userId) {
  const not = await new Noti({
    type: TYPES.ONLINE,
    postedBy: userId
  }).save();

  _updateFollowers(userId, not);
}

async function _updateFollowers(userId, noti) {
  const user = await User.findById(userId);
  console.log(user.followers, "followers");

  await User.updateMany(
    { _id: { $in: user.followers } },
    { $push: { notifications: noti._id } }
  );
}

module.exports = {
  newPost,
  likedPost,
  commentedPost,
  followedUser,
  updatedProfile,
  online
};
