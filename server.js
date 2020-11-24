// Requiring necessary npm packages
const express = require('express');
const session = require('express-session');
const exphbs = require("express-handlebars");

// Requiring passport as we've configured it
const passport = require('./config/passport');

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8000;
const db = require('./models');

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Syncing our database and logging a message to the user upon success
// TODO: change to  force: false after the initial changes are imlemented
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    });
});
