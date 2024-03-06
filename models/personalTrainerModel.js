const mongoose = require("mongoose");

const personalTrainerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "users",
      required: true
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
    minute: {
      type: String,
      enum: [30,45,60,75,90],
      required: true,
    },
  },
  { timestamps: true }
);

const personalTrainerModel = mongoose.model("personalTraineresFitness", personalTrainerSchema);
module.exports = personalTrainerModel;
