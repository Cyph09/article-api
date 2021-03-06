const { validationResult } = require("express-validator");

const Article = require("../models/article");
const User = require("../models/user");

exports.getArticles = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Article.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Article.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(articles => {
      if (articles.length <= 0) {
        const error = new Error("No article found.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Fetched articles successfully",
        articles,
        totalItems
      });
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
  const userId = req.userId;
  let author;
  const article = new Article({
    title,
    content,
    author: userId
  });

  article
    .save()
    .then(result => {
      return User.findById(userId);
    })
    .then(user => {
      author = user;
      user.articles.push(article);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Article created successfully!",
        article,
        author: { _id: author._id, name: author.name }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const { title, content } = req.body;
  const signedInUser = req.userId;
  let articleAuthorId;

  Article.findById(articleId)
    .then(article => {
      if (!article) {
        const error = new Error("Could not find article.");
        error.statusCode = 404;
        throw error;
      }
      articleAuthorId = article.author.toString();
      if (articleAuthorId !== signedInUser) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        throw error;
      }
      article.title = title;
      article.content = content;
      return article.save();
    })
    .then(result => {
      res
        .status(200)
        .json({ message: "Article updated successfully!", article: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteArticle = (req, res, next) => {
  const articleId = req.params.articleId;
  const signedInUser = req.userId;
  let articleAuthorId;
  Article.findById(articleId)
    .then(article => {
      if (!article) {
        const error = new Error("Could not find the article.");
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      articleAuthorId = article.author.toString();
      if (articleAuthorId !== signedInUser) {
        const error = new Error("Not authorized.");
        error.statusCode = 403;
        throw error;
      }
      return Article.findOneAndRemove(articleId);
    })
    .then(result => User.findById(signedInUser))
    .then(user => {
      user.articles.pull(articleId);
      return user.save();
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: "Article deleted." });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
