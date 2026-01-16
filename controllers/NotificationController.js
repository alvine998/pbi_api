const Notification = require("../models/Notification");
const { Op } = require("sequelize");

exports.listNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }

    const { count, rows } = await Notification.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
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

exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, status } = req.body;
    const notification = await Notification.create({
      userId,
      title,
      message,
      status,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Notification not found" });
    }
    await notification.update({ status: "Read" });
    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Notification not found" });
    }

    await notification.destroy();
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
