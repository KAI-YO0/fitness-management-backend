const mongoose = require("mongoose");

const classHasUserSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classModel',
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
      },
})

// Define Class model
const classModel = mongoose.model("classesFitness", classSchema);

// Define User model
const userModel = mongoose.model('users', userSchema)

// Define ClassUser model
const classHasUserModel = mongoose.model('classHasUser', classHasUserSchema);

module.exports = {
    classModel,
    userModel,
    classHasUserModel,}
