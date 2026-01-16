const Media = require("../models/Media");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { logActivity } = require("../helpers/activityLogger");

exports.listMedia = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", type } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.originalname = { [Op.like]: `%${search}%` };
    }
    if (type) {
      where.type = type;
    }

    const { count, rows } = await Media.findAndCountAll({
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

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);

    if (!media) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Media not found" });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "../", "uploads", media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const originalName = media.originalname;
    await media.destroy();
    await logActivity(
      req,
      "delete",
      "Media",
      parseInt(id),
      `Deleted media: ${originalName}`
    );

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

// This would be used internally or by a dedicated upload route that also saves to DB
exports.saveMedia = async (fileData) => {
  try {
    return await Media.create(fileData);
  } catch (error) {
    console.error("Failed to save media to database:", error.message);
    return null;
  }
};
