const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  images: {
    type: DataTypes.TEXT, // Store as JSON string or comma-separated
    get() {
      const value = this.getDataValue("images");
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue("images", JSON.stringify(value));
    },
  },
});

module.exports = Product;
