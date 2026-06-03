const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Aspiration = sequelize.define("Aspiration", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["laporan", "aspirasi", "inspirasi"]],
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  attachment: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Aspiration;
