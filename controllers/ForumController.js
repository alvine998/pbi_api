const ForumComment = require("../models/ForumComment");

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
    const comment = await ForumComment.create({ forumId: id, userId, content });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
