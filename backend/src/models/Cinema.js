import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  }
}, {
  timestamps: true
});

export default mongoose.model('Cinema', cinemaSchema);
