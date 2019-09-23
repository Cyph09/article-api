module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://mhina:mhina123@articles-api-zrbun.mongodb.net/test?retryWrites=true&w=majority",
  // "mongodb://mhina:mhina123@localhost/article",
  JWT_SECRECT: process.env.JWT_SECRECT || "sectret1"
};
