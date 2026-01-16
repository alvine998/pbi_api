const Transaction = require("../models/Transaction");
const Voucher = require("../models/Voucher");
const { Op } = require("sequelize");
const { logActivity } = require("../helpers/activityLogger");

exports.listTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, status, paymentStatus } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    const { count, rows } = await Transaction.findAndCountAll({
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

exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getTransactionByNumber = async (req, res) => {
  try {
    const { transactionNumber } = req.params;
    const transaction = await Transaction.findOne({
      where: { transactionNumber },
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const {
      userId,
      items,
      subtotal,
      discountAmount,
      voucherCode,
      tax,
      paymentMethod,
      notes,
    } = req.body;

    let voucherDiscount = 0;

    // Apply voucher if provided
    if (voucherCode) {
      const voucher = await Voucher.findOne({
        where: { code: voucherCode.toUpperCase() },
      });

      if (voucher && voucher.status === "active") {
        const now = new Date();
        const isValid =
          (!voucher.startDate || new Date(voucher.startDate) <= now) &&
          (!voucher.endDate || new Date(voucher.endDate) >= now) &&
          (!voucher.usageLimit || voucher.usedCount < voucher.usageLimit) &&
          subtotal >= (voucher.minPurchase || 0);

        if (isValid) {
          if (voucher.discountType === "percentage") {
            voucherDiscount = (subtotal * voucher.discountValue) / 100;
            if (voucher.maxDiscount && voucherDiscount > voucher.maxDiscount) {
              voucherDiscount = parseFloat(voucher.maxDiscount);
            }
          } else {
            voucherDiscount = parseFloat(voucher.discountValue);
          }

          // Update voucher used count
          await voucher.update({ usedCount: voucher.usedCount + 1 });
        }
      }
    }

    const total =
      parseFloat(subtotal) -
      parseFloat(discountAmount || 0) -
      voucherDiscount +
      parseFloat(tax || 0);

    const transaction = await Transaction.create({
      userId,
      items,
      subtotal,
      discountAmount: discountAmount || 0,
      voucherCode: voucherCode ? voucherCode.toUpperCase() : null,
      voucherDiscount,
      tax: tax || 0,
      total: total > 0 ? total : 0,
      paymentMethod,
      notes,
    });

    await logActivity(
      req,
      "create",
      "Transaction",
      transaction.id,
      `Created transaction ${transaction.transactionNumber}`
    );

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Transaction not found" });
    }

    await transaction.update({ status, paymentStatus, notes });
    await logActivity(
      req,
      "update",
      "Transaction",
      transaction.id,
      `Updated transaction ${transaction.transactionNumber}`
    );

    res.json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ error: "Not Found", message: "Transaction not found" });
    }

    const trxNumber = transaction.transactionNumber;
    await transaction.destroy();
    await logActivity(
      req,
      "delete",
      "Transaction",
      parseInt(id),
      `Deleted transaction ${trxNumber}`
    );

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
