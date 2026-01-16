const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define("Event", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
  },
  location: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("active", "cancelled", "completed"),
    defaultValue: "active",
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Event;
