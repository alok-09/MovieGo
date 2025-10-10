import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  cinemaName: {
    type: String,
    required: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  imdbID: {
    type: String,
    required: true
  },
  showtime: {
    type: String,
    required: true
  },
  showDate: {
    type: String,
    required: true
  },
  seats: [{
    type: String,
    required: true
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
