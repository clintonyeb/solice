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

// populate user
Post.deleteMany({}, err => User.deleteMany({}, err => createAdmin()));

// manually create admin
function createAdmin() {
  new User({
    username: "admin",
    firstname: "Admin",
    lastname: "User",
    bio: "Admin User",
    profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
    password: "adminuser"
  }).save((err, user) => {
    generate(user._id);
  });
}

function generate(adminId) {
  for (let i = 0; i < 20; i++) {
    const username = "user" + i;
    new User({
      username: username,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      bio: faker.company.catchPhrase(),
      profile_pic: "https://bootdey.com/img/Content/avatar/avatar2.png",
      password: username
    }).save();
  }

  for (let i = 0; i < 20; i++) {
    new Post({
      text: faker.lorem.text(),
      postedBy: adminId
    }).save();
  }
}
