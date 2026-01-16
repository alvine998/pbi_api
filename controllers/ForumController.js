const Forum = require("../models/Forum");
const ForumComment = require("../models/ForumComment");
const { Op } = require("sequelize");
const { logActivity } = require("../helpers/activityLogger");

// Forum Posts CRUD
exports.listForums = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Forum.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["isPinned", "DESC"],
        ["createdAt", "DESC"],
      ],
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

exports.getForumById = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Forum post not found" });
    }

    // Increment view count
    await forum.update({ viewCount: forum.viewCount + 1 });

    res.json(forum);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createForum = async (req, res) => {
  try {
    const {
      title,
      content,
      userId,
      userName,
      category,
      image,
      status,
      isPinned,
    } = req.body;

    const forum = await Forum.create({
      title,
      content,
      userId,
      userName,
      category,
      image,
      status,
      isPinned,
    });

    await logActivity(
      req,
      "create",
      "Forum",
      forum.id,
      `Created forum post: ${forum.title}`
    );

    res.status(201).json(forum);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateForum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, image, status, isPinned } = req.body;

    const forum = await Forum.findByPk(id);
    if (!forum) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Forum post not found" });
    }

    await forum.update({ title, content, category, image, status, isPinned });
    await logActivity(
      req,
      "update",
      "Forum",
      forum.id,
      `Updated forum post: ${forum.title}`
    );

    res.json({ message: "Forum post updated successfully", forum });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteForum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Forum post not found" });
    }

    const title = forum.title;
    // Delete associated comments
    await ForumComment.destroy({ where: { forumId: id } });
    await forum.destroy();
    await logActivity(
      req,
      "delete",
      "Forum",
      parseInt(id),
      `Deleted forum post: ${title}`
    );

    res.json({ message: "Forum post deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

// Forum Comments CRUD
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

    const forum = await Forum.findByPk(id);
    if (!forum) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Forum post not found" });
    }

    const comment = await ForumComment.create({ forumId: id, userId, content });

    // Update comment count
    await forum.update({ commentCount: forum.commentCount + 1 });

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

    // Update comment count
    const forum = await Forum.findByPk(id);
    if (forum && forum.commentCount > 0) {
      await forum.update({ commentCount: forum.commentCount - 1 });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

// Like Forum Post
exports.likeForum = async (req, res) => {
  try {
    const { id } = req.params;
    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Forum post not found" });
    }

    await forum.update({ likeCount: forum.likeCount + 1 });
    res.json({ message: "Forum post liked", likeCount: forum.likeCount + 1 });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
