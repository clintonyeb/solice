var userService = require("../services").users;
var HttpStatus = require("http-status-codes");

function authenticate(req, res, next) {
  res.json({ status: true });
}

function getUser(req, res, next) {
  const user = req.user;
  userService.getUser(user._id, (err, user) => {
    if (err || !user) return res.status(404).send("No user found");
    res.json(user);
  });
}

function getUsers(req, res, next) {
  const type = req.query.type;
  const user = req.user;

  if (!type || type === "all") {
    userService.getAllUsers(user._id, (err, users) => {
      if (err) return res.status(404).send("No users found");
      res.json(users);
    });
  } else {
    userService.getUserFull(user._id, type, (err, user) => {
      if (err) return res.status(404).send("No user found");
      res.json(user[type]);
    });
  }
}

function followUser(req, res, next) {
  const user = req.user;
  const body = req.body;
  userService.follow(user._id, body._id, (err, user) => {
    if (err || !user) return res.status(404).send("No user found");
    res.json(user);
  });
}

function unFollowUser(req, res, next) {
  const user = req.user;
  const body = req.body;
  userService.unfollow(user._id, body._id, (err, user) => {
    if (err || !user) return res.status(404).send("No user found");
    res.json(user);
  });
}

function goOnline(req, res, next) {
  const user = req.user;
  userService.getUser(user._id, (err, user) => {
    if (err) return res.status(404).send("No user found");
    res.json(user);
  });
}

function getPosts(req, res, next) {
  const user = req.user;
  userService.getPosts(user._id, (err, posts) => {
    if (err)
      return res.status(HttpStatus.NOT_FOUND).send("Error retrieving posts");
    res.json(posts);
  });
}

function getFeed(req, res, next) {
  const user = req.user;
  userService.getFeed(user._id, (err, posts) => {
    if (err)
      return res.status(HttpStatus.NOT_FOUND).send("Error retrieving posts");
    res.json(posts);
  });
}

function createPost(req, res, next) {
  const user = req.user;
  const _post = req.body;
  _post["postedBy"] = user;
  userService.createPost(_post, (err, post) => {
    if (err)
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send("Error creating post");
    res.contentType("application/json");
    res.status(HttpStatus.CREATED).json(post);
  });
}

function searchUsers(req, res, next) {
  const query = req.query.query;

  if (!query) {
    return getUsers(req, res, next);
  }

  const type = req.query.type;

  const user = req.user;
  userService.searchUsers(user._id, query, (err, users) => {
    if (err)
      return res.status(HttpStatus.NOT_FOUND).send("Error retrieving users");
    res.json(users);
  });
}

function searchFeed(req, res, next) {
  console.log("search");

  const query = req.query.query;
  if (!query) {
    return getFeed(req, res, next);
  }

  const user = req.user;
  userService.searchFeed(user._id, query, (err, posts) => {
    if (err)
      return res.status(HttpStatus.NOT_FOUND).send("Error retrieving posts");
    res.json(posts);
  });
}

module.exports = {
  authenticate,
  getUser,
  getUsers,
  getUsers,
  getFeed,
  getPosts,
  goOnline,
  createPost,
  searchFeed,
  searchUsers,
  followUser,
  unFollowUser,
  searchFeed,
  searchUsers
};
