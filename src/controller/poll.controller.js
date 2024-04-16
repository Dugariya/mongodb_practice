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
const createPolls = async (req, res) => {
  try {
    let { question, options } = req.body;
    const _res = await Poll.create({
      question,
      option: options,
      user: req.user,
    });
    _res.save();
    const user = await User.findById(req.user._id);
    await user.polls.push(_res._id);
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

const votePolls = async (req, res) => {
  try {
    const userId = req.user._id;
    const { pollId, answer } = req.body;
    if (!pollId) {
      res.status(400).json({ message: "poll id is required * " });
      return;
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
module.exports = { getPolls, createPolls, deletePolls, votePolls };
