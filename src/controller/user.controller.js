const User = require("../models/users");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isCorrect = await user.isPasswordCorrect(password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ user, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { loginController };
