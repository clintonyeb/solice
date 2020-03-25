var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
const apiRouter = require("./routes/api/v1");

var app = express();

require("dotenv").config();

app.use(logger(process.env.NODE_ENV));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(require("./config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

//  set welcome route

// set api routes
app.use("/", indexRouter);
for (const name in apiRouter) {
  app.use("/api/v1", apiRouter[name]);
}

module.exports = app;
