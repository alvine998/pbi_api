const Voucher = require("../models/Voucher");
const { Op } = require("sequelize");

exports.listVouchers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { code: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Voucher.findAndCountAll({
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

exports.getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByPk(id);

    if (!voucher) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Voucher not found" });
    }

    res.json(voucher);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getVoucherByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ where: { code } });

    if (!voucher) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Voucher not found" });
    }

    // Check if voucher is valid
    const now = new Date();
    if (voucher.status !== "active") {
      return res
        .status(400)
        .json({ error: "Invalid", message: "Voucher is not active" });
    }
    if (voucher.startDate && new Date(voucher.startDate) > now) {
      return res
        .status(400)
        .json({ error: "Invalid", message: "Voucher is not yet valid" });
    }
    if (voucher.endDate && new Date(voucher.endDate) < now) {
      return res
        .status(400)
        .json({ error: "Invalid", message: "Voucher has expired" });
    }
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return res
        .status(400)
        .json({ error: "Invalid", message: "Voucher usage limit reached" });
    }

    res.json(voucher);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      status,
    } = req.body;

    const voucher = await Voucher.create({
      code: code.toUpperCase(),
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      status,
    });

    res.status(201).json(voucher);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      status,
    } = req.body;

    const voucher = await Voucher.findByPk(id);
    if (!voucher) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Voucher not found" });
    }

    await voucher.update({
      code: code ? code.toUpperCase() : voucher.code,
      name,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      status,
    });

    res.json({ message: "Voucher updated successfully", voucher });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findByPk(id);

    if (!voucher) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Voucher not found" });
    }

    await voucher.destroy();
    res.json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
