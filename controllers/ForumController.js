const ForumComment = require("../models/ForumComment");
const { Op } = require("sequelize");

exports.listComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await ForumComment.findAndCountAll({
      where: { forumId: id },
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

exports.updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { content } = req.body;

    const comment = await ForumComment.findOne({
      where: { id: commentId, forumId: id },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Comment not found" });
    }

    await comment.update({ content });
    res.json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const comment = await ForumComment.findOne({
      where: { id: commentId, forumId: id },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Comment not found" });
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
