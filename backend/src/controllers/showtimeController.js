import Showtime from '../models/Showtime.js';
import Cinema from '../models/Cinema.js';

export const getShowtimesByCinemaAndMovie = async (req, res) => {
  try {
    const { cinemaId, imdbID } = req.params;
    const showtimes = await Showtime.find({ cinemaId, imdbID }).sort({ date: 1, time: 1 });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShowtimesByCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const showtimes = await Showtime.find({ cinemaId }).sort({ date: 1, time: 1 });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShowtime = async (req, res) => {
  try {
    const { cinemaId, imdbID, date, time, price, totalSeats } = req.body;

    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: 'Cinema not found' });
    }

    const showtime = new Showtime({
      cinemaId,
      imdbID,
      date,
      time,
      price,
      totalSeats: totalSeats || cinema.totalSeats,
      availableSeats: totalSeats || cinema.totalSeats
    });

    const newShowtime = await showtime.save();
    res.status(201).json(newShowtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.json(showtime);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.json({ message: 'Showtime deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookedSeats = async (req, res) => {
  try {
    const { cinemaId, imdbID, date, time } = req.query;

    if (!cinemaId || !imdbID || !date || !time) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const showtime = await Showtime.findOne({
      cinemaId,
      $or: [
        { movieId: imdbID },
        { imdbID: imdbID }
      ],
      date,
      time
    });

    if (!showtime) {
      return res.json({ bookedSeats: [] });
    }

    res.json({ bookedSeats: showtime.bookedSeats || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getShowtimeSeatDetails = async (req, res) => {
  try {
    const { showtimeId } = req.params;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const Booking = (await import('../models/Booking.js')).default;
    const User = (await import('../models/User.js')).default;

    const bookings = await Booking.find({
      cinemaId: showtime.cinemaId,
      imdbID: showtime.imdbID,
      showDate: showtime.date,
      showtime: showtime.time,
      status: 'confirmed'
    }).select('userId seats');

    const seatUserMap = {};

    for (const booking of bookings) {
      const user = await User.findOne({ _id: booking.userId }).select('name email');

      if (user) {
        booking.seats.forEach(seat => {
          seatUserMap[seat] = {
            userName: user.name,
            userEmail: user.email
          };
        });
      }
    }

    res.json({
      showtime: {
        _id: showtime._id,
        cinemaId: showtime.cinemaId,
        imdbID: showtime.imdbID,
        date: showtime.date,
        time: showtime.time,
        totalSeats: showtime.totalSeats,
        availableSeats: showtime.availableSeats,
        bookedSeats: showtime.bookedSeats
      },
      seatUserMap
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedShowtimes = async (req, res) => {
  try {
    await Showtime.deleteMany({});

    const cinemas = await Cinema.find();
    if (cinemas.length === 0) {
      return res.status(400).json({ message: 'Please seed cinemas first' });
    }

    const popularMovies = [
      'tt0111161',
      'tt0068646',
      'tt0468569',
      'tt0167260',
      'tt0110912',
      'tt0120737',
      'tt0109830',
      'tt0137523',
      'tt1375666',
      'tt0816692'
    ];

    const times = ['10:00', '13:00', '16:00', '19:00', '21:30'];
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const showtimes = [];

    cinemas.forEach(cinema => {
      const cinemaMovies = popularMovies.slice(0, 3 + Math.floor(Math.random() * 3));

      cinemaMovies.forEach(imdbID => {
        dates.forEach(date => {
          const movieTimes = times.slice(0, 3 + Math.floor(Math.random() * 2));

          movieTimes.forEach(time => {
            showtimes.push({
              cinemaId: cinema._id,
              imdbID,
              date,
              time,
              price: 10 + Math.floor(Math.random() * 8),
              totalSeats: cinema.totalSeats,
              availableSeats: cinema.totalSeats,
              bookedSeats: []
            });
          });
        });
      });
    });

    const createdShowtimes = await Showtime.insertMany(showtimes);

    res.status(201).json({
      message: 'Showtimes seeded successfully',
      count: createdShowtimes.length,
      showtimes: createdShowtimes.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
