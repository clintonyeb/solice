const jwt = require("express-jwt");
var express = require("express");
const authorize = require("../../../utils/authorize");
const handlers = require("../../../handlers").users;
const ROLES = require("../../../utils/user-roles");

var router = express.Router();

router.use(jwt({ secret: process.env["SECRET_KEY"] }));

router.use(authorize(ROLES.USER));

router.get("/authenticate", handlers.authenticate);

router.get("/user", handlers.getUser);

router.get("/users", handlers.getUsers);

router.put("/users", handlers.updateUser);

router.post("/users/follow", handlers.followUser);

router.post("/users/unfollow", handlers.unFollowUser);

router.delete("/posts/:id", handlers.deletePost);

router.get("/user/:id", handlers.getUserForId);

router.get("/post/:id", handlers.getPostForId);

router.get("/active", handlers.goOnline);

router.get("/users/active", handlers.getActiveUsers);

router.get("/posts", handlers.getPosts);

router.get("/feed", handlers.getFeed);

router.get("/users/search", handlers.searchUsers);

router.get("/feed/search", handlers.searchFeed);

router.post("/posts", handlers.createPost);

router.post("/posts/like", handlers.likePost);

router.post("/posts/comment", handlers.commentPost);

router.get("/posts/:postId/comments", handlers.getComments);

router.delete("/posts/:postId/comments/:commentId", handlers.deleteComment);

router.get("/users/notifications", handlers.getNotifications);

router.get("/users/ads", handlers.getAds);

module.exports = router;
