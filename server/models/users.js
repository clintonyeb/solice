// app/models/user.js
// load the things we need
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

// define the schema for our user model
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }, // _username_
  password: {
    type: String,
    required: true
  }, // 123rikwdjbfp2ioeurroasodfj[OJ[Ojsjdfag*wef
  firstname: {
    type: String,
    required: true
  }, // firstName
  lastname: {
    type: String,
    required: true
  }, // lastName
  bio: String, // A new bio
  dob: {
    day: Number,
    month: Number,
    year: Number
  }, // 23rd july 2018
  followers: Array, // ["134wr3","1q2easd2"]
  posts: Array,
  profile_pic: String, // /public/profile_pic/username/user.png
  chat_rooms: Array, // ["1234", "3456"]
  lastLogin: String, // 10 min ago
  notifications: Array, // [{msg:"New message from @user", link:"/chat/user"}]
  developer: Boolean, // true or false
  token: String, // authentication token
  role: {
    type: Number,
    enum: Object.values(require("../utils/user-roles")),
    required: true,
    default: 0
  } // user roles
});

// before save has password
userSchema.pre(
  "save",
  function(next) {
    var user = this;
    if (!user.password) next(new Error("No password found"));

    if (!user.isModified("password")) {
      return next();
    }

    bcrypt.genSalt(8, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, null, (err, hashedPassword) => {
        if (err) return next(err);
        user.password = hashedPassword;
        next();
      });
    });
  },
  function(err) {
    next(err); // true or false
  }
);

// methods ======================
// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function(cb) {
  const user = this;
  const secret = process.env["SECRET_KEY"];
  jwt.sign(
    {
      data: {
        _id: user._id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000) - 30
      }
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "24h"
    },
    function(err, token) {
      if (err) return cb(err);
      user.token = token;
      cb(null, token);
    }
  );
};

module.exports = mongoose.model("users", userSchema);

// create the model for users and expose it to our app
