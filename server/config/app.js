var DB_URL = process.env.DATABASE_ULR;
module.exports = {
  name: "solice",
  title: "solice",
  commands: {
    package:
      "electron-packager electron.js spruce --electronVersion=2.0.12 --overwrite --icon=/public/images/logo/logo.png --prune=true --out=release",
    build: ""
  },
  http: {
    host: "localhost",
    port: 8000
  },
  author: "Clinton Yeboah",
  version: "0.0.1",
  db: {
    connectionUri: "mongodb://" + DB_URL,
    params: {},
    collections: ["moment", "user", "feeling", "ask"]
  }
};
