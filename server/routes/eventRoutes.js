import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadEventPoster, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('faculty', 'admin'), uploadEventPoster, handleMulterError, createEvent);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('faculty', 'admin'), uploadEventPoster, handleMulterError, updateEvent)
  .delete(protect, authorize('faculty', 'admin'), deleteEvent);

router.route('/:id/register')
  .post(protect, registerForEvent)
  .delete(protect, unregisterFromEvent);

export default router;
