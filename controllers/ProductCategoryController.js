const ProductCategory = require("../models/ProductCategory");
const { Op } = require("sequelize");

exports.listCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (status) {
      where.status = status;
    }

    const { count, rows } = await ProductCategory.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ["sortOrder", "ASC"],
        ["name", "ASC"],
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

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByPk(id);

    if (!category) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, parentId, status, sortOrder } = req.body;
    const category = await ProductCategory.create({
      name,
      description,
      image,
      parentId,
      status,
      sortOrder,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, parentId, status, sortOrder } = req.body;

    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Category not found" });
    }

    await category.update({
      name,
      description,
      image,
      parentId,
      status,
      sortOrder,
    });

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findByPk(id);

    if (!category) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Category not found" });
    }

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
