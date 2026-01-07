const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const images = req.files ? req.files.map((f) => f.filename) : [];

    const product = await Product.create({
      name,
      price,
      category,
      description,
      images,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
