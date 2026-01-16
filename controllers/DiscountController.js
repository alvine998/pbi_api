const Discount = require("../models/Discount");
const { Op } = require("sequelize");

exports.listDiscounts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      applicableTo,
    } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (status) {
      where.status = status;
    }
    if (applicableTo) {
      where.applicableTo = applicableTo;
    }

    const { count, rows } = await Discount.findAndCountAll({
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

exports.getDiscountById = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByPk(id);

    if (!discount) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Discount not found" });
    }

    res.json(discount);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getActiveDiscounts = async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.findAll({
      where: {
        status: "active",
        [Op.or]: [{ startDate: null }, { startDate: { [Op.lte]: now } }],
        [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: now } }],
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ items: discounts });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createDiscount = async (req, res) => {
  try {
    const {
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      applicableTo,
      applicableIds,
      startDate,
      endDate,
      status,
    } = req.body;

    const discount = await Discount.create({
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      applicableTo,
      applicableIds,
      startDate,
      endDate,
      status,
    });

    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      applicableTo,
      applicableIds,
      startDate,
      endDate,
      status,
    } = req.body;

    const discount = await Discount.findByPk(id);
    if (!discount) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Discount not found" });
    }

    await discount.update({
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      applicableTo,
      applicableIds,
      startDate,
      endDate,
      status,
    });

    res.json({ message: "Discount updated successfully", discount });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByPk(id);

    if (!discount) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Discount not found" });
    }

    await discount.destroy();
    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
