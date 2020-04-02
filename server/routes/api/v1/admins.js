const jwt = require("express-jwt");
var express = require("express");
const authorize = require("../../../utils/authorize");
const ROLES = require("../../../utils/user-roles");
const handlers = require("../../../handlers").admins;

var router = express.Router();

router.use(jwt({ secret: process.env["SECRET_KEY"] }));

router.use(authorize(ROLES.ADMIN));

router.get("/admins/posts", handlers.getPosts);

router.get("/admins/users", handlers.getUsers);

router.get("/admins/words", handlers.getWords);

router.post("/admins/words", handlers.postWords);

router.put("/admins/posts/:id", handlers.updatePosts);

router.delete("/admins/posts/:id", handlers.deletePosts);

router.put("/admins/users/:id", handlers.updateUsers);

router.delete("/admins/words/:id", handlers.deleteWords);

router.post("/admins/ads", handlers.postAds);

router.get("/admins/users/requests", handlers.getRequests);

module.exports = router;
