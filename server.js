const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require("body-parser");
const router = require("./router/route");
const userRoute = require("./router/userRoute");
console.log("hii");
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(bodyParser.json());
app.use("/api/user", userRoute);
// app.use("/post", postRoute);
// app.listen(router);
mongoose.connect("mongodb://localhost/employees", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
