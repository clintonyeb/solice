var User = require("../models/users");
var Post = require("../models/posts");
var Word = require("../models/words");

const LIMIT = 25;

async function getPosts() {
  const posts = await Post.find({ status: 1 })
    .populate("postedBy")
    .sort({ created: "desc" })
    .limit(LIMIT)
    .exec();
  return posts;
}

async function getUsers() {
  const users = await User.find({ status: 1 })
    .limit(LIMIT)
    .exec();
  return users;
}

async function getWords() {
  const words = await Word.find();
  return words;
}

async function postWords(words) {
  words.split(" ").forEach(async word => {
    await new Word({ text: word }).save();
    return getWords();
  });
}

async function updatePosts(id, _post) {
  await Post.updateOne({ _id: id }, _post, { runValidators: true });
  const post = await Post.findOne({ _id: id })
    .populate("postedBy")
    .exec();
  return post;
}

async function deletePosts(id) {
  const post = await Post.findOne({ _id: id });
  const postedBy = post.postedBy;
  await Post.deleteOne({ _id: id });
  let user = await User.findOneAndUpdate(
    { _id: postedBy },
    { $inc: { deletedPosts: 1 } }
  );
  if (user.deletedPosts > 20) {
    user = await User.findOneAndUpdate({ _id: postedBy }, { status: 1 });
  }
  return post;
}

async function updateUsers(userId, _user) {
  const user = await User.findOneAndUpdate({ _id: userId }, user);
  return user;
}

async function postAds(ad) {
  // const ad = await new Ad({ text: word }).save();
}

module.exports = {
  getPosts,
  getUsers,
  getWords,
  postWords,
  updatePosts,
  deletePosts,
  updateUsers,
  updateUsers,
  postAds
};
