const express = require("express");
const Post = require("../models/post");
const Comment = require("../models/comments.model");
const Like = require("../models/likes.model");
const User = require("../models/users");
const { default: mongoose } = require("mongoose");
const postRouter = express.Router();

postRouter.get("/all", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "-password -refreshToken")
      .populate("comments", "content")
      .populate("likes");
    const postsWithCounts = posts.map((post) => ({
      _id: post._id,
      user: post.user,
      content: post.content,
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));
    // res.json(posts);
    res.status(200).json(posts);
  } catch (error) {
    res.json(error);
  }
});
postRouter.get("/all/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ author: userId }).select("-author");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});
postRouter.post("/create", async (req, res) => {
  try {
    const { _id } = req.user;
    const { title, content } = req.body;
    const post = new Post({ author: _id, title: title, content });
    const _post = await post.save();
    const user = await User.findById(_id); // Fetch the user
    user.postDetails.push(_post._id);
    await user.save(); // Save the updated user object

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
postRouter.delete("/delete-all", async (req, res) => {
  try {
    await Post.deleteMany({});
    res
      .status(200)
      .json({ message: "All Post have been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
postRouter.post("/like", async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId;

    const like = await Like.create({ user: userId, post: postId });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { likes: userId } },
      { new: true }
    );
    console.log(updatedPost, "updatedPost");
    if (!updatedPost) {
      res.status(400).json({ message: "Post not found" });
      return;
    }
    res.status(201).json(like);
    // if (!post) {
    //   return res.status(404).json({ message: "Post not found" });
    // }

    // const isAlreadyLiked = post.likes.some(
    //   (like) => JSON.stringify(like.likedBy) == JSON.stringify(userId)
    // );
    // Check if the user has already liked the post
    // const isAlreadyLiked = post.like.some((like) => like.likedBy == userId);

    // if (isAlreadyLiked) {
    //   // If user already liked the post, remove the like
    //   const updatedPost = await Post.findByIdAndUpdate(
    //     postId,
    //     { $pull: { like: { likedBy: userId } } },
    //     { new: true }
    //   );
    //   return res
    //     .status(200)
    //     .json({ message: "Unlike post successfully", data: updatedPost });
    // } else {
    //   // If user has not liked the post, add the like
    //   const updatedPost = await Post.findByIdAndUpdate(
    //     postId,
    //     { $push: { like: { likedBy: userId } } },
    //     { new: true }
    //   );
    //   return res
    //     .status(201)
    //     .json({ message: "Like post successfully", data: updatedPost });
    // }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

postRouter.post("/:postId/comments", async (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;
  const { _id: user } = req.user;

  try {
    const newComment = await Comment.create({ user, content, post: postId });
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } }, // Update the post with the new comment
      { new: true }
    );
    if (!updatedPost) {
      res.status(400).json({ message: "Post not found" });
      return;
    }

    res.status(201).json({ comment: newComment, updatedPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = postRouter;
