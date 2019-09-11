const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./config");
const articles = require("./routes/articles");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/articles", articles);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message });
});
// Server
app.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false
  });
});

// Initialize db
const db = mongoose.connection;

db.on("error", err => console.log(err));

// Handle openig of data
db.once("open", () => {
  console.log(`Server running at port ${config.PORT}`);
});
