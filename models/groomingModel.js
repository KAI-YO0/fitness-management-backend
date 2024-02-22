const mongoose = require('mongoose');
const groomingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    PetName: {
      type: String,
      require: true,
    },
    Name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      // require: true,
    },
    breed: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    idline: {
      type: String,
      require: true,
    },
    pet_type: {
      type: String,
      require: true,
    },
    grooming: {
      type: Array,
      require: true,
    },
    addon: {
      type: Array,
      require: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    bookType: {
      type: String,
      default: 'Grooming',
    },
  },
  { timestamps: true }
);

const groomingModel = mongoose.model('bookingGrooming', groomingSchema);
module.exports = groomingModel;
