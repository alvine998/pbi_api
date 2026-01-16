const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transactionNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  items: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue("items");
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue("items", JSON.stringify(value));
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  voucherCode: {
    type: DataTypes.STRING,
  },
  voucherDiscount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  tax: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM(
      "cash",
      "credit_card",
      "debit_card",
      "e_wallet",
      "bank_transfer"
    ),
    defaultValue: "cash",
  },
  paymentStatus: {
    type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
    defaultValue: "pending",
  },
  status: {
    type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
    defaultValue: "pending",
  },
  notes: {
    type: DataTypes.TEXT,
  },
});

// Generate transaction number before create
Transaction.beforeCreate(async (transaction) => {
  const date = new Date();
  const prefix = `TRX${date.getFullYear()}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const count = await Transaction.count({
    where: sequelize.where(
      sequelize.fn("DATE", sequelize.col("createdAt")),
      sequelize.fn("DATE", date)
    ),
  });
  transaction.transactionNumber = `${prefix}${String(count + 1).padStart(
    4,
    "0"
  )}`;
});

module.exports = Transaction;
