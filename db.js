const { Sequelize, DataTypes, Model } = require("sequelize");

const db = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./new_tv_inventory.db",
  logging: false,
});

module.exports = { db, DataTypes, Model };
