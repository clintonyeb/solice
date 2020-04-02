var User = require("../models/users");
var Post = require("../models/posts");
var Word = require("../models/words");
var Ad = require("../models/ads");

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

async function postWords(_words) {
  const filters = _words.split(" ");
  for (let i = 0; i < filters.length; i++) {
    const word = filters[i];
    try {
      await new Word({ text: word }).save();
    } catch (e) {}
  }
  const words = await Word.find();
  return words;
}

async function deleteWords(id) {
  await Word.deleteOne({ _id: id });
  const words = await Word.find();
  return words;
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
    await User.findOneAndUpdate({ _id: postedBy }, { status: 1 });
  }
  return post;
}

async function updateUsers(id, _user) {
  await User.updateOne({ _id: id }, _user);
  await User.update(
    { _id: id, "requests.status": 0 },
    { $set: { "requests.$.status": 1 } }
  );
  const user = await User.findOne({ _id: id });
  return user;
}

async function postAds(_ad) {
  const ad = await new Ad(_ad).save();
  return ad;
}

async function getRequests() {
  const users = await User.find({ status: 1, "requests.status": 0 });
  return users;
}

async function getAds() {
  const ads = await Ad.find();
  return ads;
}

async function deleteAds(id) {
  await Ad.deleteOne({ _id: id });
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
  postAds,
  deleteWords,
  getRequests,
  getAds,
  deleteAds
};
