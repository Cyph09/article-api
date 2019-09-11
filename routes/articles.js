const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const articleController = require("../controllers/article");

// Get all articles
router.get("/", articleController.getArticles);

// Get single article

// Publish an article
router.post(
  "/publish-article",
  [
    body("title")
      .trim()
      .isLength({ min: 5 }),
    body("content")
      .trim()
      .isLength({ min: 5 })
  ],
  articleController.createArticle
);

// Edit an article
// Delete an article

module.exports = router;
