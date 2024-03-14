
const mongoose = require("mongoose");

const paymentUserSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users",
    required: true
  },
  email: {
    type: String,
    // required: true,
  },
  firstname: {
    type: String,
    // required: true,
  },
  lastname: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const paymentUserModels = mongoose.model('payment', paymentUserSchema);
module.exports = paymentUserModels;