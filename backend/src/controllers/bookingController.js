import Booking from '../models/Booking.js';
import Cinema from '../models/Cinema.js';
import Showtime from '../models/Showtime.js';

export const createBooking = async (req, res) => {
  try {
    const { cinemaId, imdbID, showtime, showDate, seats, totalPrice, movieTitle, userId } = req.body;

    console.log('Creating booking with data:', { cinemaId, imdbID, showtime, showDate, seats, totalPrice, movieTitle, userId });

    if (!cinemaId || !imdbID || !showtime || !showDate || !seats || !totalPrice || !movieTitle || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      console.error('Cinema not found:', cinemaId);
      return res.status(404).json({ message: 'Cinema not found' });
    }

    let showtimeDoc = await Showtime.findOne({
      cinemaId,
      $or: [
        { movieId: imdbID },
        { imdbID: imdbID }
      ],
      date: showDate,
      time: showtime
    });

    if (!showtimeDoc) {
      console.log('Showtime not found, creating new showtime for cinema:', cinemaId);
      showtimeDoc = new Showtime({
        cinemaId,
        imdbID,
        movieId: imdbID,
        date: showDate,
        time: showtime,
        price: 200,
        totalSeats: cinema.totalSeats,
        availableSeats: cinema.totalSeats,
        bookedSeats: []
      });
      await showtimeDoc.save();
      console.log('New showtime created:', showtimeDoc._id);
    }

    const alreadyBookedSeats = seats.filter(seat =>
      showtimeDoc.bookedSeats.includes(seat)
    );

    if (alreadyBookedSeats.length > 0) {
      return res.status(400).json({
        message: 'Some seats are already booked',
        bookedSeats: alreadyBookedSeats
      });
    }

    showtimeDoc.bookedSeats.push(...seats);
    showtimeDoc.availableSeats -= seats.length;
    await showtimeDoc.save();

    const booking = new Booking({
      userId,
      cinemaId,
      cinemaName: cinema.name,
      movieTitle,
      imdbID,
      showtime,
      showDate,
      seats,
      totalPrice
    });

    const newBooking = await booking.save();
    console.log('Booking created successfully:', newBooking._id);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ message: error.message || 'Failed to create booking' });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    const showtimeDoc = await Showtime.findOne({
      cinemaId: booking.cinemaId,
      $or: [
        { movieId: booking.imdbID },
        { imdbID: booking.imdbID }
      ],
      date: booking.showDate,
      time: booking.showtime
    });

    if (showtimeDoc) {
      showtimeDoc.bookedSeats = showtimeDoc.bookedSeats.filter(
        seat => !booking.seats.includes(seat)
      );
      showtimeDoc.availableSeats += booking.seats.length;
      await showtimeDoc.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingsByCinema = async (req, res) => {
  try {
    const { cinemaId } = req.params;

    const bookings = await Booking.find({
      cinemaId,
      status: 'confirmed'
    }).sort({ showDate: 1, showtime: 1 });

    const movieBookings = bookings.reduce((acc, booking) => {
      const key = `${booking.imdbID}-${booking.showDate}-${booking.showtime}`;

      if (!acc[key]) {
        acc[key] = {
          imdbID: booking.imdbID,
          movieTitle: booking.movieTitle,
          showDate: booking.showDate,
          showtime: booking.showtime,
          totalBookings: 0,
          totalSeats: 0,
          bookings: []
        };
      }

      acc[key].totalBookings += 1;
      acc[key].totalSeats += booking.seats.length;
      acc[key].bookings.push({
        _id: booking._id,
        userId: booking.userId,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        bookingDate: booking.bookingDate
      });

      return acc;
    }, {});

    const result = Object.values(movieBookings);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
