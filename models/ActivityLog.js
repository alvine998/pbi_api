const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define("ActivityLog", {
  userId: {
    type: DataTypes.INTEGER,
  },
  user: {
    type: DataTypes.STRING,
  },
  action: {
    type: DataTypes.STRING,
  },
  entity: {
    type: DataTypes.STRING, // e.g., 'Product', 'User', 'Transaction'
  },
  entityId: {
    type: DataTypes.INTEGER,
  },
  target: {
    type: DataTypes.STRING,
  },
  details: {
    type: DataTypes.TEXT,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ip: {
    type: DataTypes.STRING,
  },
  userAgent: {
    type: DataTypes.STRING,
  },
});

module.exports = ActivityLog;
