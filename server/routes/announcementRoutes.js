import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAnnouncements)
  .post(protect, authorize('faculty', 'admin'), createAnnouncement);

router.route('/:id')
  .get(getAnnouncement)
  .put(protect, authorize('faculty', 'admin'), updateAnnouncement)
  .delete(protect, authorize('faculty', 'admin'), deleteAnnouncement);

export default router;
