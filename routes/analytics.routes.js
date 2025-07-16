const express = require("express");
const authorModel = require("../models/author.model");
const bookModel = require("../models/book.model");
const redisClient = require("../redis/redisClient");

const analyticsRouter = express.Router();

analyticsRouter.get("/stats/top-authors", async (req, res) => {
  const { top } = req.query;

  try {
    if (top === "true") {
      const cached = await redisClient.get("top_books");
      if (cached) return res.status(200).json(JSON.parse(cached));

      const topBooks = await bookModel.find().sort({ page: -1 }).limit(3);
      await redisClient.set("top_books", JSON.stringify(topBooks));
      res.status(200).json({
        message: "all top books",
        topBooks,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});

analyticsRouter.get("/stats/genre-breakdown", async (req, res) => {
      const { genre } = req.query;
  try {
    const result = await bookModel.aggregate([
      { $match: { genre: genre } },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({
      message: "genre-breakdown",
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
      err: err.message,
    });
  }
});
module.exports = analyticsRouter;
