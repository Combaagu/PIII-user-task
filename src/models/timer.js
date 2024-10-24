const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema mongoose
const timerSchema = new mongoose.Schema({
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  task: { type: Schema.Types.ObjectId, ref: 'Task' },
  user:{ type: Schema.Types.ObjectId, ref: 'User' }
});

const timerModel = mongoose.model("Timer", timerSchema);

module.exports = timerModel;
