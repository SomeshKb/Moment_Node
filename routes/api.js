var express = require("express");
var authRouter = require("./auth");
var momentRouter = require("./moment");

var app = express();

app.use("/auth/", authRouter);
app.use("/moment", momentRouter);

module.exports = app;