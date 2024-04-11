const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    const connectionInstace = await mongoose.connect(
      "mongodb://localhost/blogger",
      {}
    );
    console.log(
      `\n mongodb connect :: DB HOST ${connectionInstace.connection.host}`
    );
  } catch (error) {
    console.log("\n Mongo db connection failed :: ", error);
    process.exit(1);
  }
};
module.exports = connectDB;
