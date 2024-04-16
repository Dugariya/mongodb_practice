const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  title: String,
  votes: {
    type: Number,
    default: 0,
  },
});
const pollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    question: {
      type: String,
      required: [true, "Question must be required"],
    },
    option: [optionSchema],
    voted: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);
const Poll = mongoose.model("Poll", pollSchema);
module.exports = { Poll };
