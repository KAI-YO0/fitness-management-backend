const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
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
    }
  },
  { timestamps: true }
);

const serviceModel = mongoose.model("service", serviceSchema);
module.exports = serviceModel;
