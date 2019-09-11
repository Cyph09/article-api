const { validationResult } = require("express-validator");

const Article = require("../models/article");

exports.getArticles = (req, res) => {
  Article.find({}, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ message: "No article found" });
    }
    console.log(result);
    res.status(200).json(result);
  }).catch(err => console.log(err));
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
