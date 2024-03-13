
const mongoose = require("mongoose");

const reserveUserSchema = new mongoose.Schema({

  Username:  {
    type: String,
    required: [true, 'username is require'],
  },
  SelectClass: {
    type: String,
    enum: ['RPM' , 'BIKE TOUR' , 'SPIN' , 'BODYPUMP' , 'MAXED TERAIN SPIN' , 'GYMBALL'],
    required: [true, 'class is require'],
},
SelectDay: {
    type: String,
    enum: ['Monday10.00 - 11.00' , 'Tuesday13.00 - 14.00'],
    required: [true, 'sex is require'],
},
  phoneNumber: {
    type: String,
    required: true,
  },
});

const reserve = mongoose.model('reserve', reserveUserSchema);
module.exports = reserve;