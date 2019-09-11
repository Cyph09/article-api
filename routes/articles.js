const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const articleController = require("../controllers/article");

// Get all articles
router.get("/", articleController.getArticles);

// Get single article
router.get("/:articleId", articleController.getArticle);

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
router.put(
  "/update-article/:articleId",
  [
    body("title")
      .trim()
      .isLength({ min: 5 }),
    body("content")
      .trim()
      .isLength({ min: 5 })
  ],
  articleController.updateArticle
);

// Delete an article
router.delete("/delete-article/:articleId", articleController.deleteArticle);

module.exports = router;
