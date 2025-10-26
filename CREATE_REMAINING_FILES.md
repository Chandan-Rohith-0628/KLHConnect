# Complete Backend Files - Copy and Create

Due to character limits, I'll provide you with the complete code structure. Create these files manually:

## 1. Event Routes (`routes/eventRoutes.js`)
```javascript
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
```

## 2. Club Controller (`controllers/clubController.js`)
Create with these functions:
- getClubs
- getClub
- createClub (admin only)
- updateClub (admin only)
- deleteClub (admin only)
- joinClub
- leaveClub
- uploadGalleryImages
- uploadResource
- postForumMessage
- getClubMembers (admin only)

## 3. Club Routes (`routes/clubRoutes.js`)
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadClubImages, uploadClubResource, handleMulterError } from '../middleware/upload.js';
// Import all club controller functions

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
```

## 4. LostFound Controller (`controllers/lostFoundController.js`)
Functions needed:
- getItems
- getItem
- createItem
- updateItem
- deleteItem
- claimItem
- updateClaimStatus (admin only)

## 5. LostFound Routes (`routes/lostFoundRoutes.js`)
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadLostFoundImages, handleMulterError } from '../middleware/upload.js';
// Import controller functions

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, uploadLostFoundImages, handleMulterError, createItem);

router.route('/:id')
  .get(getItem)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.post('/:id/claim', protect, claimItem);
router.put('/:id/claim/:claimId', protect, authorize('admin'), updateClaimStatus);

export default router;
```

## 6. Announcement Controller (`controllers/announcementController.js`)
Functions:
- getAnnouncements
- getAnnouncement
- createAnnouncement (faculty/admin)
- updateAnnouncement (faculty/admin)
- deleteAnnouncement (faculty/admin)

## 7. Announcement Routes (`routes/announcementRoutes.js`)
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
// Import controller functions

const router = express.Router();

router.route('/')
  .get(getAnnouncements)
  .post(protect, authorize('faculty', 'admin'), createAnnouncement);

router.route('/:id')
  .get(getAnnouncement)
  .put(protect, authorize('faculty', 'admin'), updateAnnouncement)
  .delete(protect, authorize('faculty', 'admin'), deleteAnnouncement);

export default router;
```

## 8. Feedback Controller (`controllers/feedbackController.js`)
Functions:
- getAllFeedback (faculty/admin)
- getMyFeedback
- getFeedback
- createFeedback
- updateFeedbackStatus (faculty/admin)
- respondToFeedback (faculty/admin)

## 9. Feedback Routes (`routes/feedbackRoutes.js`)
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
// Import controller functions

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
```

## 10. User Routes (`routes/userRoutes.js`)
```javascript
import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadProfilePicture, handleMulterError } from '../middleware/upload.js';
// Import user controller functions

const router = express.Router();

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/upload-profile', protect, uploadProfilePicture, handleMulterError, uploadProfilePicture);

export default router;
```

## Installation Command
```bash
cd server
npm install
```

## Start Server
```bash
npm run dev
```

## Test API
Use Postman or Thunder Client to test endpoints at:
`http://localhost:5000/api`

---

**All route structures provided. Implement controller logic following the Event controller pattern.**
