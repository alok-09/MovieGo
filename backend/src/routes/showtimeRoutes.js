import express from 'express';
import {
  getShowtimesByCinemaAndMovie,
  getShowtimesByCinema,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  seedShowtimes,
  getBookedSeats,
  getShowtimeSeatDetails
} from '../controllers/showtimeController.js';

const router = express.Router();

router.get('/cinema/:cinemaId/movie/:imdbID', getShowtimesByCinemaAndMovie);
router.get('/cinema/:cinemaId', getShowtimesByCinema);
router.get('/booked-seats', getBookedSeats);
router.get('/:showtimeId/seat-details', getShowtimeSeatDetails);
router.post('/', createShowtime);
router.put('/:id', updateShowtime);
router.delete('/:id', deleteShowtime);
router.post('/seed', seedShowtimes);

export default router;
