#!/usr/bin/env node
require("dotenv").config();
var app = require("./app");
var debug = require("debug")("solice:server");
var http = require("http");
var jwt = require("jsonwebtoken");
var userService = require("./services/users");
const expressWs = require("express-ws");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

// Create websocket server

expressWs(app, server);

const activeUsers = {};
app.locals.activeUsers = activeUsers;

app.ws("/ws", function (ws, req) {
  ws.on("open", function () {
    console.log("new websocket connection...");

    setTimeout(() => {
      if (!ws._id) closeSocket(ws);
    }, 60000);
  });

  ws.on("message", function (msg) {
    // authenticate client before registering: msg.token
    const body = JSON.parse(msg);
    if (body === "ping") {
      console.log("ping from client " + ws._id);
      return;
    }

    const token = body.token;
    if (!token) return closeSocket(ws);
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) return closeSocket(ws);

    ws._id = decoded._id;
    activeUsers[decoded._id] = ws;
    userService.broadCastUserJoin(activeUsers, ws._id);
    console.log("User authenticated and added");
  });

  ws.on("error", function (_err) {
    console.error("Error with client connection");
    userService.broadCastUserLeave(activeUsers, ws._id);
    delete activeUsers[ws._id];
  });

  ws.on("close", function () {
    console.log("Client closed connection...");
    userService.broadCastUserLeave(activeUsers, ws._id);
    delete activeUsers[ws._id];
  });
});

function closeSocket(ws) {
  console.log("Invalid authentication for websocket");
  ws.close();
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
