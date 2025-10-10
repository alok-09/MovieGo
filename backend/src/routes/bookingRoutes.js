import express from 'express';
import {
  createBooking,
  getBookingsByUser,
  getBookingById,
  cancelBooking,
  getBookingsByCinema
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:userId', getBookingsByUser);
router.get('/cinema/:cinemaId', getBookingsByCinema);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
