const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Poll = sequelize.define("Poll", {
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
  },
});

const PollOption = sequelize.define("PollOption", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Poll.hasMany(PollOption, { as: "options" });
PollOption.belongsTo(Poll);

module.exports = { Poll, PollOption };
