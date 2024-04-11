const jwt = require("jsonwebtoken");
const User = require("../models/users");
const verifyJWT = async (req, res, next) => {
  try {
    const token = await req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      res.status(401).json("Invalid Access Token");
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json("Invalid Access Token");
  }
};
module.exports = { verifyJWT };
