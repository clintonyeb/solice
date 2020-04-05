var userService = require("../services").users;
const notiService = require("../services").noti;
var HttpStatus = require("http-status-codes");
const util = require("util");
const POST_STATUS = require("../utils/post-status");
const NOTI_TYPES = require("../utils/noti-types");

async function authenticate(req, res, next) {
  const getUser = util.promisify(userService.getUser);
  const user = await getUser(req.user._id);
  res.json(user);
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
    userService.getUserFull(user._id, type, (err, users) => {
      if (err) return res.status(404).send("No user found");
      res.json(users);
    });
  }
}

async function followUser(req, res, next) {
  const user = req.user;
  const body = req.body;
  try {
    const other = await userService.followUser(user._id, body._id);
    res.json(other);
    notiService.followedUser(req.app, req.user._id, body._id);
  } catch (error) {
    res.status(404).send("No user found");
  }
}

async function unFollowUser(req, res, next) {
  const user = req.user;
  const body = req.body;
  try {
    const other = await userService.unFollowUser(user._id, body._id);
    res.json(other);
    notiService.followedUser(req.app, req.user._id, body._id);
  } catch (error) {
    res.status(404).send("No user found");
  }
}

function goOnline(req, res, next) {
  const user = req.user;
  userService.getUser(user._id, (err, user) => {
    if (err) return res.status(404).send({ message: err.message });
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
        return res.status(HttpStatus.NOT_FOUND).send({ message: err.message });
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
        return res.status(HttpStatus.NOT_FOUND).send({ message: err.message });
      res.json(posts);
    },
    req.query.page
  );
}

async function createPost(req, res, next) {
  const user = req.user;
  const _post = req.body;
  _post["postedBy"] = user._id;
  try {
    const post = await userService.createPost(_post);
    res.status(HttpStatus.CREATED).json(post);
    if (req.body.notify && post.status === POST_STATUS.ENABLED) {
      notiService.newPost(req.app, user._id, post._id);
    }
    if (post.status === POST_STATUS.DISABLED) {
      const noti = {
        type: NOTI_TYPES.POST_FLAGGED,
        postedBy: user._id,
        targetPost: post._id,
        created: Date.now(),
      };
      userService.notifyUser(req.app, user._id, noti);
      userService.notifyAdmins(noti);
    }
  } catch (error) {
    console.log(error);

    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: error.message });
  }
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
      return res.status(HttpStatus.NOT_FOUND).send({ message: err.message });
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

async function likePost(req, res, next) {
  try {
    const post = await userService.likePost(req.user._id, req.body.postId);
    res.json(post);
    notiService.likedPost(req.app, req.user._id, post._id);
  } catch (error) {
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: error.message });
  }
}

async function commentPost(req, res, next) {
  try {
    const post = await userService.commentPost(
      req.user._id,
      req.body.postId,
      req.body.text
    );
    res.json(post);
    notiService.commentedPost(req.app, req.user._id, post._id);
  } catch (error) {
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: err ? err.message : "Error retrieving posts" });
  }
}

function deleteComment(req, res, next) {
  return userService.deleteComment(
    req.params.postId,
    req.params.commentId,
    (err, post) => {
      if (err)
        return res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .send({ message: err.message });
      return res.json(post);
    }
  );
}

function getComments(req, res, next) {
  return userService.getComments(req.params.postId, (err, comments) => {
    if (err)
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .send({ message: err.message });
    return res.json(comments);
  });
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.user._id, req.body);
    res.json(user);
    notiService.updatedProfile(req.app, req.user._id);
  } catch (error) {
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: error.message });
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
      .send({ message: error.message });
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
      .send({ message: error.message });
  }
}

async function getAds(req, res, next) {
  try {
    const ad = await userService.getAds(req.user._id);
    res.json(ad);
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: error.message });
  }
}

module.exports = {
  authenticate,
  getUser,
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
  getAds,
};
