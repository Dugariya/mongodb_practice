const express = require("express");
const bodyParser = require("body-parser");
const { userRoute, postRouter } = require("./router");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(bodyParser.json());
app.use("/api/user", userRoute);
app.use("/api/post", postRouter);
module.exports = { app };
