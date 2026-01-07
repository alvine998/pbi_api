const ChatMessage = require("../models/Chat");

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
