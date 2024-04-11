const User = require("../models/users");
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const user = await User.findOne({ $or: [{ email }, { userName }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isCorrect = await user.isPasswordCorrect(password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const logedUser = await User.findById(user._id).select(
      "-password -refreshToken "
    );
    res.status(200).json({
      logedUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "User logout successfully" });
  } catch (error) {}
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      res
        .status("401")
        .json({ message: "Invalid refresh token or expired token" });
    }
    if (refreshToken !== user?.refreshToken) {
      res.status(401).json({ message: "Refresh token is expired or used" });
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    res.status(201).json({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
      message: "Access token refreshed",
    });
  } catch (error) {
    res.status(500).json({
      message: "server error while re-generating access token",
      error,
    });
  }
};
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new error();
  }
};
module.exports = { loginController, logoutUser, refreshAccessToken };
