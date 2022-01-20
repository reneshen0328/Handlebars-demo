// Instantiate all the dependencies needed
const express = require("express");
const app = express();

const Handlebars = require("handlebars");
const { engine } = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const { seed } = require("./index");
const { Show, User } = require("./Models/index");
const port = 3000;
const { Op } = require("sequelize");

// Configurating hanlebars library to work well w/ express + sequelize model
const handlebars = engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// Tell this express app that we're using handlebars
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

// support the parsing of incoming requests with urlencoded payloads (e.g. form POST)
app.use(express.urlencoded({ extended: false }));
// support the parsing of incoming requests with json payloads
app.use(express.json());
// Server static assets from the public folder instead of JSON file
app.use(express.static("public"));

// Express middleware
// A route that will get all the shows.
/* NOTE: res.render(arg1 , arg2 , arg3):
    arg1: name of the HTML page which is to be rendered (the handlebars file name)
    arg2: an object containing local variables for the view parameter passed (inside the handlebars file)
    arg3: a callback function that is passed as a parameter.
*/
app.get("/shows", async (req, res) => {
  const shows = await Show.findAll();
  res.render("shows", { shows });
});

// A route that will get one show.
// If no show found, throw 404 page
app.get("/shows/:id", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  if (show) {
    res.render("show", { show });
  } else {
    res.send("404 not found");
  }
});

// Creating new show using HTML forms & handlebars
app.get("/new-show-form", (req, res) => {
  res.render("newShowForm");
});
app.post("/new-show", async (req, res) => {
  const newShow = await Show.create(req.body);
  const foundShow = await Show.findByPk(newShow.id);
  if (foundShow) {
    res.status(200).send("New show created");
  } else {
    console.log("oh no!");
  }
});

// Deleting a show using HTML form , handlebars, and DOM
app.delete("/shows/:id", async (req, res) => {
  const deletedShow = await Show.destroy({ where: { id: req.params.id } });
  res.send("DELETED");
});

//Updating the likes for the specific show
app.put("/shows/:id", async (req, res) => {
  const updatedShow = await Show.update(req.body, {
    where: { id: req.params.id },
  });
  res.send({ updatedShow });
});

// Server start listening
app.listen(port, async () => {
  await seed();
  console.log(`The server is listening to PORT: ${port}`);
});
