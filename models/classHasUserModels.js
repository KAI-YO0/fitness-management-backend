const mongoose = require("mongoose");

const classHasUserSchema = new mongoose.Schema({
      classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
});

const classHasUserModels = mongoose.model('classHasUsers', classHasUserSchema);

module.exports = classHasUserModels;
