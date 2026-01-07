const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Aspiration = sequelize.define("Aspiration", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
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
