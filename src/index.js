const { app } = require("./app");
const connectDB = require("./db");
require("dotenv").config();
const port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error, "error while connecting db");
  });
