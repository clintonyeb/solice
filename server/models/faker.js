var faker = require("faker");
var mongoose = require("mongoose");

// connect to db
// mongoose.connection.db.dropDatabase();

mongoose.connect(require("../config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// populate models
var User = require("../models/users");
var Post = require("../models/posts");
var Comment = require("../models/comments");
var Notifications = require("../models/notifications");

// populate user
seed();

async function seed() {
  await Post.deleteMany({});
  await User.deleteMany({});
  await Comment.deleteMany({});
  await Notifications.deleteMany({});

  const admin = await createAdmin();
  await createUser();
  await generate(admin._id);
  process.exit(0);
}

// manually create admin
async function createAdmin() {
  const user = await new User({
    username: "admin",
    firstname: "Admin",
    lastname: "User",
    bio: "Admin User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "adminuser",
    role: 2
  }).save();
  return user;
}

async function createUser() {
  await new User({
    username: "user",
    firstname: "Test",
    lastname: "User",
    bio: "Test User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "testuser",
    role: 0
  }).save();
}

async function generate(adminId) {
  for (let i = 0; i < 20; i++) {
    const username = "user" + i;
    await new User({
      username: username,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      bio: faker.company.catchPhrase(),
      profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
      password: username
    }).save();
  }

  for (let i = 0; i < 20; i++) {
    await new Post({
      text: faker.lorem.text(),
      postedBy: adminId
    }).save();
  }
}
