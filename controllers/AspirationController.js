const Aspiration = require("../models/Aspiration");
const { Op } = require("sequelize");

const VALID_TYPES = ["laporan", "aspirasi", "inspirasi"];

exports.listAspirations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, type } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    const { count, rows } = await Aspiration.findAndCountAll({
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

exports.getAspirationById = async (req, res) => {
  try {
    const { id } = req.params;
    const aspiration = await Aspiration.findByPk(id);

    if (!aspiration) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Aspiration not found" });
    }

    res.json(aspiration);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createAspiration = async (req, res) => {
  try {
    const { type, title, content } = req.body;

    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "type must be one of: laporan, aspirasi, inspirasi",
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        error: "Bad Request",
        message: "title and content are required",
      });
    }

    const attachment = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/aspirations/${
          req.file.filename
        }`
      : null;

    const aspiration = await Aspiration.create({
      type,
      title,
      content,
      attachment,
    });
    res.status(201).json(aspiration);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const aspiration = await Aspiration.findByPk(id);
    if (!aspiration) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Aspiration not found" });
    }

    await aspiration.update({ status });
    res.json({ message: "Status updated successfully", aspiration });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteAspiration = async (req, res) => {
  try {
    const { id } = req.params;
    const aspiration = await Aspiration.findByPk(id);

    if (!aspiration) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Aspiration not found" });
    }

    await aspiration.destroy();
    res.json({ message: "Aspiration deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
