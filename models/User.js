const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "User",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Active",
  },
  phone: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  lastLogin: {
    type: DataTypes.DATE,
  },
  kycStatus: {
    type: DataTypes.STRING,
    defaultValue: "unverified",
  },
  isKycVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  kycRejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = User;
