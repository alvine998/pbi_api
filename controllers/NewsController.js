const News = require("../models/News");

exports.createNews = async (req, res) => {
  try {
    const { title, category, content, status, image } = req.body;
    const news = await News.create({ title, category, content, status, image });
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
