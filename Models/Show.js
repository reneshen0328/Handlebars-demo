const { db, DataTypes, Model } = require("../db");

class Show extends Model {}

Show.init(
  {
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    rating: DataTypes.NUMBER,
    status: DataTypes.STRING,
    image: DataTypes.STRING,
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
  }
);

module.exports = { Show };
