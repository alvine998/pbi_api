const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { logActivity } = require("../helpers/activityLogger");

exports.listUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
    } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
        ...(role && { role }),
        ...(status && { status }),
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ["password"] },
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      items: rows,
    });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      role,
      status,
      password: hashedPassword,
    });

    await logActivity(
      req,
      "create",
      "User",
      user.id,
      `Created user ${user.email}`
    );

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({
      error: "Validation Error",
      message: error.message,
      fields: error.errors
        ? error.errors.reduce(
            (acc, curr) => ({ ...acc, [curr.path]: curr.message }),
            {}
          )
        : {},
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, phone } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    await user.update({ name, email, role, status, phone });
    await logActivity(
      req,
      "update",
      "User",
      user.id,
      `Updated user ${user.email}`
    );

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({ message: "User updated successfully", user: userResponse });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "User not found" });
    }

    const email = user.email;
    await user.destroy();
    await logActivity(
      req,
      "delete",
      "User",
      parseInt(id),
      `Deleted user ${email}`
    );

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
