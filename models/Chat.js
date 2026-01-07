const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChatMessage = sequelize.define("ChatMessage", {
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "text",
  },
});

module.exports = ChatMessage;
