const moment = require("moment");
const { Poll } = require("../models/poll.model");
const User = require("../models/users");

const getPolls = async (req, res) => {
  try {
    const _res = await Poll.find({})
      .populate("user", "name")
      .populate("voted", "name _d");
    const pollsWithVotedCount = _res.map((poll) => ({
      ...poll._doc,
      votedCount: poll.voted.length,
    }));
    res.status(201).json(pollsWithVotedCount);
  } catch (error) {
    res.json({ message: error.message });
  }
};
const getSinglePolls = async (req, res) => {
  try {
    const { pollId } = req.params;
    console.log(req.query);

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll is not found" });
    }
    res.status(201).json({ message: "success", poll: poll });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const createPolls = async (req, res) => {
  try {
    let { question, option, startTime, endTime } = req.body;

    const _res = await Poll.create({
      question,
      option: option,
      user: req.user,
      startTime: startTime,
      endTime: endTime,
    });
    _res.save();
    const user = await User.findById(req.user._id);
    user.polls.push(_res._id);
    user.save();
    res.status(201).json(_res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deletePolls = async (req, res) => {
  try {
    const _res = await Poll.deleteMany({});
    res.status(201).json(_res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteOnePolls = async (req, res) => {
  try {
    console.log(req.query, req.params);
    const _res = await Poll.findByIdAndDelete({ _id: req.query.pollId });
    if (!_res) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(201).json({ message: "delete poll successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const votePolls = async (req, res) => {
  try {
    const currentTime = new moment();

    const userId = req.user._id;
    const { pollId, answer } = req.body;
    if (!pollId) {
      res.status(400).json({ message: "poll id is required * " });
      return;
    }
    const poll = await Poll.findById(pollId);
    if (poll.voted.includes(userId)) {
      res.status(201).json("Your have already votes");
    }
    const pollEndTime = moment(poll.endTime);
    const pollStartTime = moment(poll.startTime);
    if (currentTime > pollEndTime) {
      return res.status(403).json({ error: "Voting has ended for this poll" });
    }
    if (currentTime < pollStartTime) {
      return res
        .status(403)
        .json({ error: "Voting is not yet open for this poll" });
    }
    const _res = await Poll.findByIdAndUpdate(
      { _id: pollId },
      {
        $push: { voted: userId },
      }
    );
    if (!_res) {
      res.status(400).json({ message: "poll not found" });
      return;
    }
    _res.option[answer].votes++; // electronic voting machine
    _res.save();
    res.status(201).json(_res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getPolls,
  createPolls,
  deletePolls,
  votePolls,
  getSinglePolls,
  deleteOnePolls,
};
