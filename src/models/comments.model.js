const { default: mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
    },
    content: String,
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the Post model
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
