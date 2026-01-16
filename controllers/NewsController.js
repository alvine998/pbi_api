const News = require("../models/News");
const { Op } = require("sequelize");

exports.listNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, category } = req.query;
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
    if (category) {
      where.category = category;
    }

    const { count, rows } = await News.findAndCountAll({
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

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);

    if (!news) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "News not found" });
    }

    res.json(news);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const { title, category, content, status, image } = req.body;
    const news = await News.create({ title, category, content, status, image });
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content, status, image } = req.body;

    const news = await News.findByPk(id);
    if (!news) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "News not found" });
    }

    await news.update({ title, category, content, status, image });
    res.json({ message: "News updated successfully", news });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByPk(id);

    if (!news) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "News not found" });
    }

    await news.destroy();
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
