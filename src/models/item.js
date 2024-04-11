const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
  },
  description: String,
});

module.exports = mongoose.model("Item", itemSchema);
