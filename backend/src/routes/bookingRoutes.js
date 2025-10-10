import express from 'express';
import {
  createBooking,
  getBookingsByUser,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/user/:userId', getBookingsByUser);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
