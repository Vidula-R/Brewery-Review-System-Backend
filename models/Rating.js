const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  breweryId: { type: String, required: true }, 
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  description: String,
});

module.exports = mongoose.model('Rating', ratingSchema);
