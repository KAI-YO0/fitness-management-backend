
const mongoose = require("mongoose");


const reserveClassSchema = new mongoose.Schema({

  userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users",
      required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId, 
      ref: "classes",
      required: true
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  className: {
    type: String,
  },
  classDate: {
    type: String , 
    
  },
  // phoneNumber: {
  //   type: String,
  //   required: true,
  // },
});

const reserve = mongoose.model('reserveClass', reserveClassSchema);
module.exports = reserve;