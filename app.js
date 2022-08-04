const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const serverConfig = require("./config/server.config");
const User = require("./Model/user.model");

app.get("/", (req, res) => {
  console.log(req);
  console.log("res:", res);
});
mongoose.connect(serverConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
  console.log("Some err while connecting to db");
});
db.once("open", () => {
  console.log("connected");
});

require("./Routes/userAuth.route")(app);
require("./Routes/user.route")(app);
require("./Routes/ticket.route")(app);
const change = require("./new");
change.change();
app.listen(serverConfig.PORT, () => {
  console.log("started the server");
});
