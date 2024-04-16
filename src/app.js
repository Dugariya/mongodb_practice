const express = require("express");
const bodyParser = require("body-parser");
const { userRoute, postRouter } = require("./router");
const { verifyJWT } = require("./middlewares/auth.middleware");
const pollRoute = require("./router/poll.route");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(bodyParser.json());
app.use("/api/user", userRoute);
app.use("/api/post", verifyJWT, postRouter);
app.use("/api/poll", verifyJWT, pollRoute);
module.exports = { app };
