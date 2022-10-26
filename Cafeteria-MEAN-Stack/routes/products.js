const express = require("express");
const router = express.Router();
const ProductModel = require("../models/product");

const CategorytModel = require("../models/category");

// Create Product
router.post("/", async (req, res) => {
  const productData = {
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
    productTo: req.body.productTo,
  };
  const product = new ProductModel(productData);

  try {
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const prodcts = await ProductModel.find({}).populate("productTo").exec();
    res.status(200).json(prodcts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get producsts of category
router.get("/category", async (req, res, next) => {
  const query = req.query.category;

  try {
    const category = await CategorytModel.find({
      name: { $regex: query, $options: "i" },
    });

    if (category.length == 0) {
      res.status(400).json(" Not Found 404 !");
    }

    const filteredProducts = await ProductModel.find({
      productTo: category[0]._id,
    })
      .populate("productTo")
      .exec();

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Search product by name
router.get("/search", async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    return res.json({
      error: "Missing required name parameter",
    });
  }
  try {
    if (query) {
      // const product = await ProductModel.find({
      //   name: { $regex: query },
      //   $options: "i",
      // })
      const product = await ProductModel.find({
        name: { $regex: new RegExp(query, "i") },
      })
        .populate("productTo")
        .exec();
      console.log(product);
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});
// Get one product by ID
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await ProductModel.findOne({ _id })
      .populate("productTo")
      .exec();
    user ? res.status(200).json(user) : res.status(500).json("user not found");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    await ProductModel.deleteOne({ _id });
    res.status(204).send("Deleted Successed");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// edit product

router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const product = {
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
    timestamp: new Date(),
    size: req.body.size,
  };
  try {
    await ProductModel.findByIdAndUpdate({ _id }, product);
    let updatedProduct = await ProductModel.findById({ _id });
    console.log(updatedProduct);

    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// update price only!
router.patch("/:id", async (req, res) => {
  console.log(req.body);
  const _id = req.params.id;
  try {
    await ProductModel.updateOne({ _id }, { price: req.body.price });
    res.status(200).send("Updated Success");
    console.log("Updated deleted");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = { productsRouter: router };
