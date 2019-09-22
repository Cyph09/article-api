const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const articleController = require("../controllers/article");
const isAuth = require("../middleware/is-auth");

// Get all articles
router.get("/", isAuth, articleController.getArticles);

// Get single article
router.get("/:articleId", isAuth, articleController.getArticle);

// Publish an article
router.post(
  "/publish-article",
  isAuth,
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
  isAuth,
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
router.delete(
  "/delete-article/:articleId",
  isAuth,
  articleController.deleteArticle
);

module.exports = router;
