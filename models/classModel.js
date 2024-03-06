const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
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
    motivations: {
      type: String,
      enum: ["easy","moderate","advance"],
      required: true
    },
    intensity: {
      type: String,
      enum: ["low","mid","high"],
      required: true,
    },
    minute: {
      type: String,
      enum: [30,45,60,75,90],
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
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

const classModel = mongoose.model("classesFitness", classSchema);
module.exports = classModel;
