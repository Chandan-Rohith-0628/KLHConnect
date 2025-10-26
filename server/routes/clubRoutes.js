import express from 'express';
import {
  getClubs,
  getClub,
  createClub,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  uploadGalleryImages,
  uploadResource,
  postForumMessage,
  getClubMembers
} from '../controllers/clubController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadClubImages, uploadClubResource, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getClubs)
  .post(protect, authorize('admin'), createClub);

router.route('/:id')
  .get(getClub)
  .put(protect, authorize('admin'), updateClub)
  .delete(protect, authorize('admin'), deleteClub);

router.post('/:id/join', protect, joinClub);
router.post('/:id/leave', protect, leaveClub);
router.post('/:id/gallery', protect, uploadClubImages, handleMulterError, uploadGalleryImages);
router.post('/:id/resources', protect, uploadClubResource, handleMulterError, uploadResource);
router.post('/:id/forum', protect, postForumMessage);
router.get('/:id/members', protect, authorize('admin'), getClubMembers);

export default router;
