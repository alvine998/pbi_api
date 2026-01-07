const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
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
