require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });

const error = require("./middleware/error");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// load routes.
require("./startup/routes")(app);

// middleware to handle errors.
app.use(error);

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on ${process.env.PORT}`);
});

module.exports = server;
