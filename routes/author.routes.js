const express = require("express");
const authorModel = require("../models/author.model");
const redisClient = require("../redis/redisClient");
const authmiddleware = require("../middlewares/auth.middleware");


const authorRouter = express.Router();

authorRouter.get("/authors", async (req, res) => {
  try {
    const authors = await authorModel.find();
    res.status(200).json({
      message: "authors are fetched",
      authors,
    });
  } catch (err) {
    res.status(500).json({
      message: "failed to fetched author",
    });
  }
});

authorRouter.post("/authors", async (req, res) => {
  try {
    const author = await authorModel.create(req.body);
    res.status(201).json({
      message: "author created",
      author,
    });
  } catch (err) {
    res.status(400).json({
      message: "failed to create",
    });
  }
});
authorRouter.delete("/authors/:_id", async (req, res) => {
  try {
    const author = await authorModel.findByIdAndDelete(
      req.params.id,
      { isDeletd: true },
      { new: true }
    );
    res.status(200).json({
      message: "author deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "failed to deleted",
      err:err.message
    });
  }
});

module.exports = authorRouter;
