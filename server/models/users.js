var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

var userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    bio: String,
    dob: {
      day: Number,
      month: Number,
      year: Number,
    },
    profile_pic: String,
    lastLogin: String,
    notifications: [
      {
        type: {
          type: Number,
          enum: Object.values(require("../utils/noti-types")),
          required: true,
        },
        targetUser: { type: mongoose.Schema.ObjectId, ref: "users" },
        targetPost: { type: mongoose.Schema.ObjectId, ref: "posts" },
        created: { type: Date, default: Date.now },
        postedBy: { type: mongoose.Schema.ObjectId, ref: "users" },
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],
    role: {
      type: Number,
      enum: Object.values(require("../utils/user-roles")),
      required: true,
      default: 0,
    },
    subscriptions: [{ type: mongoose.Schema.ObjectId, ref: "users" }], // refers to this user's subscriptions
    subscribers: [{ type: mongoose.Schema.ObjectId, ref: "users" }], // refers to subscriptions to this users
    status: {
      type: Number,
      enum: Object.values(require("../utils/user-status")),
      required: true,
      default: 2,
    },
    deletedPosts: Number,
    requests: [
      {
        text: String,
        created: { type: Date, default: Date.now },
        status: Number, // 0: pending, 1: resolved, 2: rejected
      },
    ],
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

// before save has password
userSchema.pre(
  "save",
  function (next) {
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
  function (err) {
    next(err); // true or false
  }
);

// methods ======================
// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateToken = function (cb) {
  const user = this;
  const secret = process.env["SECRET_KEY"];
  jwt.sign(
    {
      _id: user._id,
      iat: Math.floor(Date.now() / 1000) - 30,
      role: user.role,
    },
    secret,
    {
      algorithm: "HS256",
      expiresIn: "24h",
    },
    function (err, token) {
      if (err) return cb(err);
      cb(null, token);
    }
  );
};

userSchema.virtual("name").get(function () {
  return this.lastname + " " + this.firstname;
});

userSchema.virtual("age").get(function () {
  if (!this.dob) return -1;
  const now = new Date();
  return now.getFullYear() - this.dob.year;
});

userSchema.index({ email: "text" });
module.exports = mongoose.model("users", userSchema);
