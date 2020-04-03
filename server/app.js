require("dotenv").config();
var express = require("express");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var HttpStatus = require("http-status-codes");
const cron = require("node-cron");
const userService = require("./services/users");

var indexRouter = require("./routes/index");
const apiRoutes = require("./routes/api/v1");

var app = express();

app.use(cors());
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(require("./config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// mongoose.set("debug", true);

// set api routes
app.use("/", indexRouter);
apiRoutes.forEach(route => app.use("/api/v1", route));

app.use(function(err, req, res, next) {
  console.error(err);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Cannot authenticate request..." });
  }
  res.status(HttpStatus.NOT_FOUND).json({
    error: "An error occurred whiles processing request.."
  });
});

cron.schedule("30 * * * *", userService.runCronJob);

module.exports = app;
