const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillsSchema = new Schema({

  skills: [String],
  
});

const skills = mongoose.model("skills", skillsSchema);

module.exports = skills;
