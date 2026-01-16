const Product = require("../models/Product");
const { Op } = require("sequelize");

exports.listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      where.category = category;
    }

    const { count, rows } = await Product.findAndCountAll({
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

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, categoryId, description, stock, images } =
      req.body;
    const uploadedImages = req.files ? req.files.map((f) => f.filename) : [];

    const product = await Product.create({
      name,
      price,
      category,
      categoryId,
      description,
      stock: stock || 0,
      images: images || uploadedImages,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, categoryId, description, stock, images } =
      req.body;
    const uploadedImages = req.files
      ? req.files.map((f) => f.filename)
      : undefined;

    const product = await Product.findByPk(id);
    if (!product) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Product not found" });
    }

    const updateData = {
      name,
      price,
      category,
      categoryId,
      description,
      stock,
    };
    if (images) {
      updateData.images = images;
    } else if (uploadedImages) {
      updateData.images = uploadedImages;
    }

    await product.update(updateData);
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
