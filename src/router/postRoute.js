const express = require("express");
const Post = require("../models/post");
const Comment = require("../models/comments.model");
const postRouter = express.Router();

postRouter.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});
postRouter.get("/all/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId }).populate("author");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});
postRouter.post("/create", async (req, res) => {
  try {
    const post = new Post(req.body);
    const _post = await post.save();
    res.json(_post);
  } catch (error) {
    res.json(error);
  }
});
postRouter.put("/update/:id", async (req, res) => {
  const postId = req.params.id;
  const updatedPostData = req.body;
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedPostData, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
postRouter.delete("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (post) {
      res.status(201).json({ message: "delete post successfully", data: post });
      return;
    }
    return res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
postRouter.post("/like", async (req, res) => {
  try {
    const userId = req.body.userId;
    const postId = req.body.postId;
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { like: { likedBy: userId } },
    });
    if (post) {
      res.status(201).json({ message: "like post successfully", data: post });
      return;
    }
    return res.status(404).json({ message: "Post not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

postRouter.post("/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const { user, content } = req.body;

  try {
    const newComment = await Comment.create({ user, content, post: postId });
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } }, // Update the post with the new comment
      { new: true }
    );

    res.status(201).json({ comment: newComment, updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = postRouter;
