
const mongoose = require("mongoose");

const paymentUserSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
//   image: {
//     type: Buffer, // เก็บ binary data
//     required: true,
//   },
  imageType: {
    type: String, // เก็บประเภทของไฟล์รูปภาพ (เช่น image/jpeg, image/png)
    required: true,
  },
});

const paymentUserModels = mongoose.model('payment', paymentUserSchema);
module.exports = paymentUserModels;