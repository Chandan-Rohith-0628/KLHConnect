import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadProfilePicture
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProfilePicture as uploadMiddleware, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.post('/upload-profile', protect, uploadMiddleware, handleMulterError, uploadProfilePicture);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;
