const ChatMessage = require("../models/Chat");
const { Op } = require("sequelize");

exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ChatMessage.findAndCountAll({
      where: { sessionId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "ASC"]],
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

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { text, type } = req.body;
    const message = await ChatMessage.create({ sessionId, text, type });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;
    const message = await ChatMessage.findOne({
      where: { id: messageId, sessionId },
    });

    if (!message) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Message not found" });
    }

    await message.destroy();
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
