var express = require("express");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var hbs = require("hbs");
const roleName = require("./utils/helpers").roleName;

require("dotenv").config();

var indexRouter = require("./routes/index");
const apiRoutes = require("./routes/api/v1");

var app = express();

app.use(cors());
app.use(logger(process.env.NODE_ENV));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// views setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, 'views/partials/'));
hbs.registerHelper("getRole", (role) => roleName(role));

mongoose.connect(require("./config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


// set api routes
app.use("/", indexRouter);
apiRoutes.forEach(route => app.use("/api/v1", route));

// app.use(function(err, req, res, next) {
//   if (err.name === "UnauthorizedError") {
//     res.status(401).json("Invalid token received with request...");
//   }
// });

module.exports = app;
