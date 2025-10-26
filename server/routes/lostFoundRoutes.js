import express from 'express';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  claimItem,
  updateClaimStatus
} from '../controllers/lostFoundController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadLostFoundImages, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, uploadLostFoundImages, handleMulterError, createItem);

router.route('/:id')
  .get(getItem)
  .put(protect, uploadLostFoundImages, handleMulterError, updateItem)
  .delete(protect, deleteItem);

router.post('/:id/claim', protect, claimItem);
router.put('/:id/claim/:claimId', protect, authorize('admin'), updateClaimStatus);

export default router;
