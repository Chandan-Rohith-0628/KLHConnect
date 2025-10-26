import express from 'express';
import {
  getAllFeedback,
  getMyFeedback,
  getFeedback,
  createFeedback,
  updateFeedbackStatus,
  respondToFeedback
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('faculty', 'admin'), getAllFeedback)
  .post(protect, createFeedback);

router.get('/my', protect, getMyFeedback);

router.route('/:id')
  .get(protect, getFeedback)
  .put(protect, authorize('faculty', 'admin'), updateFeedbackStatus);

router.post('/:id/respond', protect, authorize('faculty', 'admin'), respondToFeedback);

export default router;
