const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "I am new!"
  },
  article: [
    {
      type: Schema.Types.ObjectId,
      ref: "Article"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
