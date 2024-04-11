const express = require("express");
const userRoute = express.Router();
const multer = require("multer");
const User = require("../models/users");
const { loginController } = require("../controller/user.controller");
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
userRoute.get("/", (req, res) => {
  User.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json("Errord : " + err));
});

userRoute.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      password: req.body.password,
      profileImage: req.file ? req.file.originalname : "default_image.jpg",
    });
    let _res = await user.save();
    res
      .status(201)
      .json({ user: _res, message: "User registered successfully" });
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

module.exports = userRoute;
