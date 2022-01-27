// Instantiate all the dependencies needed
const express = require("express");
const app = express();

const session = require("express-session");
const cookieParser = require("cookie-parser");

// bcrypt saves users info!!!!
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
// Configure app to use session and cookie parser
app.use(cookieParser());
app.use(
  session({
    secret: "secretkeyfornow",
    resave: false,
    saveUninitialized: true,
  })
);

// Express middleware
// A route that will get all the shows.
/* NOTE: res.render(arg1 , arg2 , arg3):
    arg1: name of the HTML page which is to be rendered (the handlebars file name)
    arg2: an object containing local variables for the view parameter passed (inside the handlebars file)
    arg3: a callback function that is passed as a parameter.
*/

app.get("/", (req, res) => {
  res.redirect("/shows");
});

app.get("/shows", async (req, res) => {
  const shows = await Show.findAll();
  let user = "Guest";

  if (req.session.emailaddress) {
    user = req.session.emailaddress;
  }

  res.render("shows", { shows, user });
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
  res.send(deletedShow ? "DELETED" : "Delete failed");
});

//Updating the likes for the specific show
app.put("/shows/:id", async (req, res) => {
  const updatedShow = await Show.update(req.body, {
    where: { id: req.params.id },
  });
  res.send({ updatedShow });
});

// A route that render sign up form
app.get("/signup", (req, res) => {
  let alert = "";
  res.render("signup");
});

// A route for User to Sign up
app.post("/signup", async (req, res) => {
  // Access emailaddress, password, and password confirmation from HTML form
  const emailaddress = req.body.emailaddress;
  const password = req.body.password;
  const confirm = req.body.confirm;

  // Search for duplicate
  const findDuplicate = await User.findOne({
    where: { emailaddress: emailaddress },
  });

  // Check if the passwords match. If not, sign up fails. If match, add user to database
  if (password !== confirm) {
    let alert = "Wrong password!!!";
    res.render("signup", { alert });
    // declare emailaddress must be unique
  } else if (findDuplicate) {
    let alert = "Email address has been used!!!";
    res.render("signup", { alert });
  } else {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const newUser = await User.create({
        emailaddress: emailaddress,
        password: hash,
      });
      // Render form again
      // Sroting user id and emailaddress in session data
      req.session.userID = newUser.id;
      req.session.emailaddress = newUser.emailaddress;
      let alert = "Signup success :)";
      res.render("signup", { alert });
    });
  }
});

// Render the sign in form
app.get("/signin", (req, res) => {
  let alert = "";
  res.render("signin", { alert });
});

// Post new user sign in
app.post("/signin", async (req, res) => {
  // Find one emailaddress where emailaddress in db matches the form emailaddress
  const thisUser = await User.findOne({
    where: { emailaddress: req.body.emailaddress },
  });

  // If that user doesn't exist, sign in fails
  if (!thisUser) {
    let alert = "User not found!!!";
    res.render("signin", { alert });
    // If passwords dont match, sign in fails
    // Else sign in succeeds
  } else {
    // Sroting user id and emailaddress in session data
    bcrypt.compare(
      req.body.password,
      thisUser.password,
      async (err, result) => {
        if (result) {
          req.session.userID = thisUser.id;
          req.session.emailaddress = thisUser.emailaddress;
          let alert = `Welcome back ${thisUser.emailaddress}`;
          res.render("signin", { alert });
        } else {
          let alert = "wrong password!!!";
          res.render("signin", { alert });
        }
      }
    );
  }
});

// Get route to logout user
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/shows");
  });
});

// // A route for user to favorite a show
// app.get("/favorite/:show", (req,res) => {
//   req.session.favorite = req.params.show
//   res.redirect("/shows")
// })
// // user clicks "fav" btn
// // Set session favortie to this show
// // Show favorite show in template

// Server start listening
app.listen(port, async () => {
  await seed();
  console.log(`The server is listening to PORT: ${port}`);
});
