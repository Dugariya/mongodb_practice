const express = require("express");
const router = express.Router();
const Item = require("../models/item");

// Get all items
router.get("/items", (req, res) => {
  console.log("get items ......");
  Item.find()
    .then((items) => res.json(items))
    .catch((err) => res.status(400).json("Errord : " + err));
});

// Add a new item
router.post("/items", (req, res) => {
  console.log("..........", req.body);
  const newItem = new Item(req.body);
  newItem
    .save()
    .then(() => res.json("Item added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Update an item
router.put("/items/:id", (req, res) => {
  Item.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json("Item updated!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Delete an item
router.delete("/items/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then(() => res.json("Item deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});
// Delete all items
router.delete("/items", (req, res) => {
  Item.deleteMany() // Deletes all items
    .then(() => res.json("All items deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
