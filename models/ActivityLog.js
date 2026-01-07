const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define("ActivityLog", {
  user: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
  },
  target: {
    type: DataTypes.STRING,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ip: {
    type: DataTypes.STRING,
  },
});

module.exports = ActivityLog;
