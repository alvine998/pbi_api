const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Voucher = sequelize.define("Voucher", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  discountType: {
    type: DataTypes.ENUM("percentage", "fixed"),
    defaultValue: "percentage",
  },
  discountValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  minPurchase: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(15, 2),
  },
  usageLimit: {
    type: DataTypes.INTEGER,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "expired"),
    defaultValue: "active",
  },
});

module.exports = Voucher;
