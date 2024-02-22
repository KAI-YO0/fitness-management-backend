const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const galleryModel = mongoose.model('gallery', GallerySchema);
module.exports = galleryModel;