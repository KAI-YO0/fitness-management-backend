const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const newsModel = mongoose.model('news', NewsSchema);
module.exports = newsModel;
