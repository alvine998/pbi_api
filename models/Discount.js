const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Discount = sequelize.define("Discount", {
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
  applicableTo: {
    type: DataTypes.ENUM("all", "category", "product"),
    defaultValue: "all",
  },
  applicableIds: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue("applicableIds");
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue("applicableIds", JSON.stringify(value));
    },
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
});

module.exports = Discount;
