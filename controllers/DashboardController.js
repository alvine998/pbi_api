const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Voucher = require("../models/Voucher");
const ProductCategory = require("../models/ProductCategory");
const News = require("../models/News");
const Aspiration = require("../models/Aspiration");
const ActivityLog = require("../models/ActivityLog");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

exports.getSummary = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalTransactions,
      totalVouchers,
      totalCategories,
      totalNews,
      totalAspirations,
    ] = await Promise.all([
      User.count(),
      Product.count(),
      Transaction.count(),
      Voucher.count({ where: { status: "active" } }),
      ProductCategory.count({ where: { status: "active" } }),
      News.count(),
      Aspiration.count(),
    ]);

    // Get transaction stats
    const transactionStats = await Transaction.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("total")), "totalRevenue"],
        [sequelize.fn("AVG", sequelize.col("total")), "avgOrderValue"],
      ],
      where: { paymentStatus: "paid" },
      raw: true,
    });

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayTransactions, todayUsers, todayRevenue] = await Promise.all([
      Transaction.count({ where: { createdAt: { [Op.gte]: today } } }),
      User.count({ where: { createdAt: { [Op.gte]: today } } }),
      Transaction.sum("total", {
        where: {
          createdAt: { [Op.gte]: today },
          paymentStatus: "paid",
        },
      }),
    ]);

    res.json({
      summary: {
        users: totalUsers,
        products: totalProducts,
        transactions: totalTransactions,
        activeVouchers: totalVouchers,
        categories: totalCategories,
        news: totalNews,
        aspirations: totalAspirations,
      },
      revenue: {
        total: parseFloat(transactionStats?.totalRevenue || 0),
        avgOrderValue: parseFloat(transactionStats?.avgOrderValue || 0),
      },
      today: {
        transactions: todayTransactions,
        newUsers: todayUsers,
        revenue: todayRevenue || 0,
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.findAll({
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.json({ items: activities });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const transactions = await Transaction.findAll({
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.json({ items: transactions });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getTransactionChart = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const transactions = await Transaction.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("total")), "total"],
      ],
      where: {
        createdAt: { [Op.gte]: startDate },
        paymentStatus: "paid",
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    res.json({ items: transactions });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const byRole = await User.findAll({
      attributes: [
        "role",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["role"],
      raw: true,
    });

    const byStatus = await User.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    res.json({ byRole, byStatus });
  } catch (error) {
    res.status(400).json({ error: "Bad Request", message: error.message });
  }
};
