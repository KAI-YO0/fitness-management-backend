const mongoose = require('mongoose');

const slipSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const slipModel = mongoose.model('slipImage', slipSchema);
module.exports = slipModel;
