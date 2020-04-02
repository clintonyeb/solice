var adminService = require("../services").admins;
// var HttpStatus = require("http-status-codes");

async function getPosts(req, res, next) {
  const posts = await adminService.getPosts();
  res.json(posts);
}

async function getUsers(req, res, next) {
  const users = await adminService.getUsers();
  res.json(users);
}

async function getWords(req, res, next) {
  const words = await adminService.getWords();
  res.json(words);
}

async function postWords(req, res, next) {
  const words = await adminService.postWords(req.body.text);
  res.json(words);
}

async function deleteWords(req, res, next) {
  const words = await adminService.deleteWords(req.params.id);
  res.json(words);
}

async function updatePosts(req, res, next) {
  const post = await adminService.updatePosts(req.params.id, req.body);
  res.json(post);
}

async function deletePosts(req, res, next) {
  const post = await adminService.deletePosts(req.params.id);
  res.json(post);
}

async function updateUsers(req, res, next) {
  const user = await adminService.updateUsers(req.params.id, req.body);
  res.json(user);
}

async function postAds(req, res, next) {
  const ad = await adminService.postAds(req.body);
  res.json(ad);
}

async function getRequests(req, res, next) {
  const users = await adminService.getRequests();
  res.json(users);
}

async function getAds(req, res, next) {
  const ads = await adminService.getAds();
  res.json(ads);
}

async function deleteAds(req, res, next) {
  await adminService.deleteAds(req.params.id);
  res.json(true);
}

module.exports = {
  getPosts,
  getUsers,
  getWords,
  postWords,
  updatePosts,
  deletePosts,
  updateUsers,
  postAds,
  deleteWords,
  getRequests,
  getAds,
  deleteAds
};
