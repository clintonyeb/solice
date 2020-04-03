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
  mongoose.connection.close();
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
    password: "adminuser",
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
  for (let i = 0; i < 20; i++) {
    const username = "user" + i;
    await new User({
      email: `${username}@gm.com`,
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
      postedBy: adminId,
      status: 0
    }).save();
  }
}

async function addFilters() {
  await new Word({ text: "fuck" }).save();
}
