const { validationResult } = require("express-validator");

const Article = require("../models/article");

exports.getArticles = (req, res) => {
  Article.find()
    .then(articles => {
      res
        .status(200)
        .json({ message: "Fetched articles successfully", articles });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  Article.findById(articleId)
    .then(article => {
      if (!article) {
        const error = new Error("Article not found.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Article fetched", article });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createArticle = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({
    //   message: "Validation failed, entered data is incorrect.",
    //   errors: errors.array()
    // });
  }
  const { title, content } = req.body;
  const article = new Article({
    title,
    content,
    author: { name: "Swaleh" }
  });

  article
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Article created successfully!",
        article: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
