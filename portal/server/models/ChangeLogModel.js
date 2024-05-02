const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const changeLogSchema = new Schema({


  title: String,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  
  checked: {
    type: Boolean,
    default: false
  }
 
})

const changeLog = mongoose.model('changeLog', changeLogSchema);

module.exports = changeLog;
