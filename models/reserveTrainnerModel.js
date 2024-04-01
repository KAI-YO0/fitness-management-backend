const mongoose = require("mongoose");


const reserveTrainnerSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users",
    required: true
  },
  firstname: {
    type: String,
  },
  // lastname: {
  //   type: String,
  // },
  StartHour: {
    type: Date, 
    required: true
  },
  EndHour: {
    type: Date, 
    required: true
  },
  // phoneNumber: {
  //   type: String,
  //   required: true,
  // },
});

const reserveTrainner = mongoose.model('reserveTrainner', reserveTrainnerSchema);
module.exports = reserveTrainner;