var userService = require("../services").users;
const notiService = require("../services").noti;
var HttpStatus = require("http-status-codes");

function authenticate(req, res, next) {
  res.json(req.user);
}

function getUser(req, res, next) {
  const user = req.user;
  userService.getUser(user._id, (err, user) => {
    if (err || !user) return res.status(404).send("No user found");
    res.json(user);
  });
}

function getUserForId(req, res, next) {
  userService.getUser(req.params.id, (err, user) => {
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
    notiService.followedUser(req.app, req.user._id, body._id);
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
    notiService.online(req.app, req.user._id);
  });
}

function getPosts(req, res, next) {
  const user = req.user;
  userService.getPosts(
    user._id,
    (err, posts) => {
      if (err)
        return res.status(HttpStatus.NOT_FOUND).send("Error retrieving posts");
      res.json(posts);
    },
    req.query.page
  );
}

function getFeed(req, res, next) {
  const user = req.user;
  userService.getFeed(
    user._id,
    (err, posts) => {
      if (err)
        return res.status(HttpStatus.NOT_FOUND).send("Error retrieving posts");
      res.json(posts);
    },
    req.query.page
  );
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
    res.status(HttpStatus.CREATED).json(post);
    if (req.body.notify) {
      notiService.newPost(req.app, req.user._id, post._id);
    }
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
  const query = req.query.query;
  if (!query) {
    return getFeed(req, res, next);
  }
  const user = req.user;
  userService.searchFeed(
    user._id,
    query,
    (err, posts) => {
      if (err)
        return res.status(HttpStatus.NOT_FOUND).send("Error retrieving posts");
      res.json(posts);
    },
    req.query.page
  );
}

function likePost(req, res, next) {
  return userService.likePost(req.user._id, req.body.postId, (err, post) => {
    if (err)
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send("Error retrieving posts");
    res.json(post);
    notiService.likedPost(req.app, req.user._id, post._id);
  });
}

function commentPost(req, res, next) {
  return userService.commentPost(
    req.user._id,
    req.body.postId,
    req.body.text,
    (err, post) => {
      if (err)
        return res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ error: err ? err.message : "Error retrieving posts" });
      res.json(post);
      notiService.commentedPost(req.app, req.user._id, post._id);
    }
  );
}

function deleteComment(req, res, next) {
  return userService.deleteComment(
    req.params.postId,
    req.params.commentId,
    (err, post) => {
      if (err)
        return res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .send("Error retrieving posts");
      return res.json(post);
    }
  );
}

function getComments(req, res, next) {
  return userService.getComments(req.params.postId, (err, comments) => {
    if (err)
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send("Error retrieving posts");
    return res.json(comments);
  });
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.user._id, req.body);
    res.json(user);
    notiService.updatedProfile(req.app, req.user._id);
  } catch (error) {
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).send("Error retrieving posts");
  }
}

async function getNotifications(req, res, next) {
  try {
    const notifications = await userService.getNotifications(req.user._id);
    res.json(notifications);
    await userService.deleteNotifications(req.user._id);
  } catch (error) {
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send("Error retrieving notifications");
  }
}

async function getActiveUsers(req, res, next) {
  try {
    const activeUsers = await userService.getActiveFollowing(
      req.app,
      req.user._id
    );
    res.json(activeUsers);
  } catch (error) {
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send("Error retrieving active users...");
  }
}

async function getAds(req, res, next) {
  try {
    const ad = await userService.getAds(req.user._id);
    res.json(ad);
  } catch (error) {
    console.error(error);
    res.json(error);
  }
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
  searchUsers,
  likePost,
  commentPost,
  deleteComment,
  getComments,
  updateUser,
  getUserForId,
  getNotifications,
  getActiveUsers,
  getAds
};
