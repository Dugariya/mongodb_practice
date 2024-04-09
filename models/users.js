const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["blogger", "software engineer"],
    },
    profileImage: {
      type: String || File,
      default: "default_profile_image.jpg",
    },
    bio: {
      type: String,
      default: "",
    },
    socialMedia: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("user", userSchema);
