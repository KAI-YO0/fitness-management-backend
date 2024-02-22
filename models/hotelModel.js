const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users",
      required: true
    },
    Name: {
      type: String,
      required: true,
    },
    PetName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    startDate: {
      type: Object,
      required: true,
    },
    endDate: {
      type: Object,
      required: true,
    },
    time: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    bookType: {
      type: String,
      default: "Hotel",
    },
    lineId: {
      type: String,
      required: true,
    },
    petinfo: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const hotelModel = mongoose.model("bookingHotel", hotelSchema);
module.exports = hotelModel;
