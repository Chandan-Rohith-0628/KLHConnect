# KLHConnect Backend - Installation & Setup Guide

## ✅ Backend Complete Structure

### What's Been Created:
1. ✅ **6 MongoDB Models** with relationships
2. ✅ **Authentication System** (JWT-based)
3. ✅ **File Upload System** (Multer)
4. ✅ **Error Handling**
5. ✅ **Auth Controller & Routes**
6. ✅ **Event Controller & Routes**
7. ✅ **Server Configuration**

### What You Need to Create:
The remaining controllers follow the same pattern as Event controller. Here's the structure:

## 📦 Quick Installation

### Step 1: Install Dependencies
```bash
cd server
npm install
```

This installs all required packages from package.json.

### Step 2: Ensure MongoDB is Running
```bash
# Windows
net start MongoDB

# Or use MongoDB Compass
# Or use MongoDB Atlas (cloud)
```

### Step 3: Start the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## 🔗 API Testing

### Health Check
```
GET http://localhost:5000/api/health
```

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@klh.edu.in",
  "password": "password123",
  "studentId": "2021001",
  "role": "student",
  "department": "CSE",
  "year": 3,
  "phone": "9876543210"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@klh.edu.in",
  "password": "password123"
}
```

Response will include JWT token. Use it in subsequent requests:
```
Authorization: Bearer <your_token_here>
```

## 📝 Remaining Controllers to Create

You can create the remaining controllers by following the Event controller pattern. Here are the key functions each needs:

### Club Controller (`controllers/clubController.js`)
```javascript
import Club from '../models/Club.js';
import User from '../models/User.js';

export const getClubs = async (req, res, next) => { /* Get all clubs */ };
export const getClub = async (req, res, next) => { /* Get single club */ };
export const createClub = async (req, res, next) => { /* Create club - Admin only */ };
export const updateClub = async (req, res, next) => { /* Update club - Admin only */ };
export const deleteClub = async (req, res, next) => { /* Delete club - Admin only */ };
export const joinClub = async (req, res, next) => { /* Join club */ };
export const leaveClub = async (req, res, next) => { /* Leave club */ };
export const uploadGalleryImages = async (req, res, next) => { /* Upload images */ };
export const uploadResource = async (req, res, next) => { /* Upload resource */ };
export const postForumMessage = async (req, res, next) => { /* Post message */ };
export const getClubMembers = async (req, res, next) => { /* Get members - Admin only */ };
```

### LostFound Controller (`controllers/lostFoundController.js`)
```javascript
import LostFound from '../models/LostFound.js';

export const getItems = async (req, res, next) => { /* Get all items */ };
export const getItem = async (req, res, next) => { /* Get single item */ };
export const createItem = async (req, res, next) => { /* Create item */ };
export const updateItem = async (req, res, next) => { /* Update item */ };
export const deleteItem = async (req, res, next) => { /* Delete item */ };
export const claimItem = async (req, res, next) => { /* Claim item */ };
export const updateClaimStatus = async (req, res, next) => { /* Update claim - Admin */ };
```

### Announcement Controller (`controllers/announcementController.js`)
```javascript
import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res, next) => { /* Get all */ };
export const getAnnouncement = async (req, res, next) => { /* Get single */ };
export const createAnnouncement = async (req, res, next) => { /* Create - Faculty/Admin */ };
export const updateAnnouncement = async (req, res, next) => { /* Update - Faculty/Admin */ };
export const deleteAnnouncement = async (req, res, next) => { /* Delete - Faculty/Admin */ };
```

### Feedback Controller (`controllers/feedbackController.js`)
```javascript
import Feedback from '../models/Feedback.js';

export const getAllFeedback = async (req, res, next) => { /* Get all - Faculty/Admin */ };
export const getMyFeedback = async (req, res, next) => { /* Get user's feedback */ };
export const getFeedback = async (req, res, next) => { /* Get single */ };
export const createFeedback = async (req, res, next) => { /* Create */ };
export const updateFeedbackStatus = async (req, res, next) => { /* Update - Faculty/Admin */ };
export const respondToFeedback = async (req, res, next) => { /* Respond - Faculty/Admin */ };
```

### User Controller (`controllers/userController.js`)
```javascript
import User from '../models/User.js';

export const getAllUsers = async (req, res, next) => { /* Get all - Admin */ };
export const getUser = async (req, res, next) => { /* Get single */ };
export const updateUser = async (req, res, next) => { /* Update */ };
export const deleteUser = async (req, res, next) => { /* Delete - Admin */ };
export const uploadProfilePicture = async (req, res, next) => { /* Upload profile pic */ };
```

## 🎯 Quick Start Commands

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Frontend Integration

Update your frontend API configuration:

```javascript
// client/src/utils/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Add token to requests
const token = localStorage.getItem('token');
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 📊 Database Collections

Once server starts, MongoDB will automatically create these collections:
- users
- events
- clubs
- lostfounds
- announcements
- feedbacks

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] User registration works
- [ ] User login works and returns token
- [ ] Protected routes require authentication
- [ ] File uploads work
- [ ] Role-based access control works

## 🚀 Production Deployment

For production:
1. Change JWT_SECRET in .env
2. Use MongoDB Atlas for database
3. Set NODE_ENV=production
4. Use proper CORS settings
5. Enable HTTPS
6. Use environment-specific .env files

---

**Backend is 80% complete! Core functionality ready. Create remaining controllers following the Event controller pattern.** 🎉
