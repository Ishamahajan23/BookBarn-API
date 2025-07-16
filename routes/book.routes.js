const express = require("express");
const bookModel = require("../models/book.model");
const redisClient = require("../redis/redisClient");
const authmiddleware = require("../middlewares/auth.middleware");


const bookRouter = express.Router();

bookRouter.get("/books", async (req, res) => {
  try {
    const books = await bookModel.find();
    res.status(200).json({
      message: "books are fetched",
      books,
    });
  } catch (err) {
    res.status(500).json({
      message: "failed to fetched books",
    });
  }
});

bookRouter.post("/books", async (req, res) => {
  try {
    const book = await bookModel.create(req.body);
    res.status(201).json({
      message: "book created",
      book,
    });
  } catch (err) {
    res.status(400).json({
      message: "failed to create",
    });
  }
});
bookRouter.delete("/books/:id", async (req, res) => {
  try {
    const book = await bookModel.findByIdAndDelete(
      req.params.id,
      { isDeletd: true },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({
        message: "book not found",
      });
    }
    res.status(200).json({
      message: "book deleted successfully",
      book,
    });
  } catch (err) {
    res.status(500).json({
      message: "failed to deleted",
    });
  }
});

module.exports = bookRouter;
