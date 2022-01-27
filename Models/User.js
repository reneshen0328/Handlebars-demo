const { db, DataTypes, Model } = require("../db");

class User extends Model {}

User.init(
  {
    emailaddress: {
      type: DataTypes.STRING,
      allowNull: false, // Or unique, but can set in server
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { User };
