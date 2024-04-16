const { Router } = require("express");
const express = require("express");
const { Poll } = require("../models/poll.model");
const {
  getPolls,
  createPolls,
  deletePolls,
  votePolls,
} = require("../controller/poll.controller");
const route = express.Router();
route.get("/", getPolls).post("/", createPolls).delete("/delete", deletePolls);
route.post("/vote", votePolls);
module.exports = route;
