module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://mhina:mhina123@localhost/article",
  // "urmongodb+srv://mhina:mhina123@cluster0-ynfvv.mongodb.net/test?retryWrites=true&w=majorityi",
  JWT_SECRECT: process.env.JWT_SECRECT || "sectret1"
};
