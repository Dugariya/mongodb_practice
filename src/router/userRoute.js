const express = require("express");
const userRoute = express.Router();
const multer = require("multer");
const User = require("../models/users");
const {
  loginController,
  logoutUser,
  refreshAccessToken,
} = require("../controller/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for storing
  },
});

const upload = multer({ storage: storage });

// Get all items
userRoute.get("/", async (req, res) => {
  try {
    // const usersWithPosts = await User.find().populate("postDetails");
    const usersWithPosts = await User.find().populate(
      "polls",
      "question option"
    );
    res.status(201).json(usersWithPosts);
  } catch (error) {
    res.status(400).json("Errord : " + err);
  }
});

userRoute.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const _existUser = await User.findOne({ email: req.body.email });
    if (_existUser) {
      res.status(409).json({ message: "user already exist" });
      return;
    }
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      password: req.body.password,
      profileImage: req.file ? req.file.originalname : "default_image.jpg",
    });

    let _res = await user.save();
    const returnUser = await User.find({ _id: _res._id }).select(
      "-password -refreshToken"
    );
    res
      .status(201)
      .json({ user: returnUser, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
userRoute.post("/login", loginController);

// Route to get user details by ID
userRoute.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
userRoute.delete("/deleteAll", async (req, res) => {
  try {
    await User.deleteMany({});
    res
      .status(200)
      .json({ message: "All users have been deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
userRoute.post("/refresh-token", refreshAccessToken);
//secure routes
userRoute.post("/logout", verifyJWT, logoutUser);
module.exports = userRoute;
