import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  },
  imdbID: {
    type: String,
    required: true
  },
  movieId: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 100
  },
  bookedSeats: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

showtimeSchema.index({ cinemaId: 1, imdbID: 1, date: 1 });
showtimeSchema.index({ cinemaId: 1, movieId: 1, date: 1 });

export default mongoose.model('Showtime', showtimeSchema);
