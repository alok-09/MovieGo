import express from 'express';
import {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
  seedCinemas
} from '../controllers/cinemaController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getAllCinemas);
router.get('/:id', getCinemaById);
router.post('/', protect, restrictTo('admin'), createCinema);
router.put('/:id', protect, restrictTo('admin'), updateCinema);
router.delete('/:id', protect, restrictTo('admin'), deleteCinema);
router.post('/seed', seedCinemas);

export default router;
