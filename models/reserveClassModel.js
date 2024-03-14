const mongoose = require("mongoose");


const reserveUserSchema = new mongoose.Schema({

  userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users",
      required: true
  },
  firstname: {
    type: String,
},
  lastname: {
    type: String,
},
  SelectClass: {
    type: String,
    enum: ['RPM' , 'BIKE TOUR' , 'SPIN' , 'BODYPUMP' , 'MIXED TERRAIN SPIN' , 'GYMBALL'],
    required: [true, 'class is require'],
},
SelectDay: {
    type: String,
    enum: ['Monday10.00 - 11.00' , 'Tuesday13.00 - 14.00' , 'WEDNESDAY10.00 - 11.00' , 'THURSDAY13.00 - 14.00' ,'SATURDAY 13.00 - 14.00' , 'FRIDAY 10.00 - 11.00' 
    ,'FRIDAY 13.00 - 14.00','SATURDAY 10.00 - 11.00' ,'Wednesday 13.00 - 14.00' ,'Thursday 10.00 - 11.00','MONDAY 13.00 - 14.00','TUESDAY 10.00 - 11.00'],
    required: true,
},
  phoneNumber: {
    type: String,
    required: true,
  },
});

const reserve = mongoose.model('reserve', reserveUserSchema);
module.exports = reserve;