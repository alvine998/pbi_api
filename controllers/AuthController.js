const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const { logActivity } = require("../helpers/activityLogger");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Google idToken and GOOGLE_CLIENT_ID are required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Google account email is not verified",
      });
    }

    let user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      user = await User.create({
        name: payload.name || payload.email,
        email: payload.email,
        password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12),
        avatar: payload.picture || null,
        role: "User",
        status: "Active",
      });
    }

    await user.update({ lastLogin: new Date() });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    await logActivity(
      { ...req, user: { id: user.id, email: user.email, name: user.name } },
      "google_login",
      "User",
      user.id,
      `User ${user.email} logged in with Google`
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid Google idToken",
    });
  }
};

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

      // Log login activity
      await logActivity(
        { ...req, user: { id: user.id, email: user.email } },
        "login",
        "User",
        user.id,
        `User ${user.email} logged in`
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

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "User",
      status: "Active",
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "24h" }
    );

    // Log register activity
    await logActivity(
      { ...req, user: { id: user.id, email: user.email } },
      "register",
      "User",
      user.id,
      `New user ${user.email} registered`
    );

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "Registration successful",
      user: userResponse,
      token,
    });
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

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    const avatar = user.avatar;

    await logActivity(
      { ...req, user: { id: user.id, email: user.email, name: user.name } },
      "delete_account",
      "User",
      user.id,
      `User ${user.email} requested account deletion`
    );

    await user.destroy();

    if (avatar) {
      const avatarPath = path.join(__dirname, "..", "uploads", avatar);
      fs.unlink(avatarPath, (error) => {
        if (error && error.code !== "ENOENT") {
          console.error("Failed to delete avatar:", error.message);
        }
      });
    }

    res.json({
      message: "Account deleted successfully",
      deletedData: [
        "Account profile",
        "Email address",
        "Phone number",
        "Password hash",
        "Avatar file when available",
      ],
      retainedData: [
        "Transaction, audit, security, and legal records may be retained for up to 90 days unless a longer period is required by law.",
      ],
    });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
