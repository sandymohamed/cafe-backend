const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/category");

// Create category
router.post("/", async (req, res) => {
  const newCategory = {
    name: req.body.name,
  };
  const category = new CategoryModel(newCategory);

  try {
    const savedCategory = await category.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await CategoryModel.find({});

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await CategoryModel.find({});

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get one category
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await CategoryModel.findOne({ _id });

    category
      ? res.status(200).json(category)
      : res.status(500).json("category not found");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    await CategoryModel.deleteOne({ _id });
    res.status(204).send("Deleted Successed");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// update category
router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const category = {
    name: req.body.name,
    timestamp: new Date(),
  };

  try {
    await CategoryModel.updateOne({ _id },  category );
    res.status(200).send("Updated Success");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = { categoriesRouter: router };
