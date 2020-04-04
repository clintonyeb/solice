var faker = require("faker");
var mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// connect to db
mongoose.connect(require("../config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// populate models
var User = require("../models/users");
var Post = require("../models/posts");
var Word = require("../models/words");

// populate user
seed();

async function seed() {
  await Post.deleteMany({});
  await User.deleteMany({});
  await Word.deleteMany({});

  const admin = await createAdmin();
  await createUser();
  await createSuspendedUser();
  await generate(admin._id);
  await addFilters();
  await mongoose.connection.close();
  process.exit(0);
}

// manually create admin
async function createAdmin() {
  const user = await new User({
    email: "admin@gm.com",
    firstname: "Admin",
    lastname: "User",
    bio: "Admin User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "testuser",
    role: 2,
    status: 0
  }).save();
  return user;
}

async function createUser() {
  await new User({
    email: "user@gm.com",
    firstname: "Test",
    lastname: "User",
    bio: "Test User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "testuser",
    role: 0,
    status: 0
  }).save();

  await new User({
    email: "user2@gm.com",
    firstname: "Test2",
    lastname: "User",
    bio: "Test2 User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "testuser",
    role: 0,
    status: 0
  }).save();

  await new User({
    email: "user1@gm.com",
    firstname: "Test1",
    lastname: "User",
    bio: "Test1 User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "testuser",
    role: 0,
    status: 0
  }).save();
}

async function createSuspendedUser() {
  await new User({
    email: "suspended@gm.com",
    firstname: "Suspended",
    lastname: "User",
    bio: "Suspended User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "testuser",
    role: 0,
    status: 1
  }).save();
}

async function generate(adminId) {
  for (let i = 0; i < 5; i++) {
    const username = "test" + i;
    await new User({
      email: `${username}@gm.com`,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      bio: faker.company.catchPhrase(),
      profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
      password: username
    }).save();
  }

  for (let i = 0; i < 5; i++) {
    await new Post({
      text: faker.lorem.text(),
      postedBy: adminId,
      status: 0
    }).save();
  }
}

async function addFilters() {
  const words = fs.readFileSync(
    path.join(__dirname, "../utils/banned-words.txt"),
    "utf8"
  );
  await asyncForEach(words.split(/\r?\n/), async word => {
    if (word) {
      await new Word({ text: word }).save();
    }
  });
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
