const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currentStageSchema = new Schema({

  currentStages: [String],
  
});

const currentStageClient = mongoose.model("currentStageClient", currentStageSchema);

module.exports = currentStageClient;
