const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const langSchema = new Schema({

  languages: [String],
  
});

const langs = mongoose.model("languages", langSchema);

module.exports = langs;
