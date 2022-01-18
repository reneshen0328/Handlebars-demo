const path = require("path");
const fs = require("fs").promises;

const { db } = require("./db");
const { Show, User } = require("./Models/index");

const seed = async () => {
  await db.sync({ force: true });

  const seedPathShow = path.join(__dirname, "./JSON/shows.json");
  const seedPathUser = path.join(__dirname, "./JSON/users.json");

  const bufferShow = await fs.readFile(seedPathShow);
  const { dataShows } = JSON.parse(bufferShow);

  const bufferUser = await fs.readFile(seedPathUser);
  const { dataUsers } = JSON.parse(bufferUser);

  const showPromises = dataShows.map((show) => Show.create(show));
  const userPromises = dataUsers.map((user) => User.create(user));

  await Promise.all(showPromises);
  await Promise.all(userPromises);

  console.log(`All of the shows and users model have been created!`);
};

module.exports = { seed };
