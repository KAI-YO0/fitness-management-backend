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
    date: {
      type: Date , 
      require: true
    }
  },
  { timestamps: true }
);

const classModel = mongoose.model("classes", classSchema);
module.exports = classModel;
