const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currentStageSchema = new Schema({

  currentStages: [String],
  
});

const currentStageVa = mongoose.model("currentStageVa", currentStageSchema);

module.exports = currentStageVa;
