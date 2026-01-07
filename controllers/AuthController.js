const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "your_jwt_secret_key_here",
        { expiresIn: "24h" }
      );
      return res.json({ token });
    }

    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid credentials" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const avatar = req.file ? req.file.filename : undefined;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    await user.update({ name, email, phone, avatar });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.update({ password: hashedPassword });
      return res.json({ message: "Password changed successfully" });
    }

    res
      .status(401)
      .json({ error: "Unauthorized", message: "Invalid current password" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
