const { Router } = require("express");
const express = require("express");
const { Poll } = require("../models/poll.model");
const {
  getPolls,
  createPolls,
  deletePolls,
  votePolls,
  getSinglePolls,
  deleteOnePolls,
} = require("../controller/poll.controller");
const route = express.Router();
route.get("/", getPolls).post("/", createPolls).delete("/delete", deletePolls);
route.post("/vote", votePolls);
route.get("/:pollId", getSinglePolls);
route.delete("/delete/one", deleteOnePolls);
module.exports = route;
