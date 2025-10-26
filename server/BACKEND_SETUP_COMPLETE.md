# KLHConnect Backend - Complete Setup Guide

## ✅ Backend Structure Created

### Database Models (MongoDB with Mongoose)
All models created with proper relationships and validations:

1. **User Model** (`models/User.js`)
   - Fields: name, email, password (hashed), studentId, role, department, year, phone, profilePicture, bio
   - Relationships: registeredClubs[], registeredEvents[]
   - Methods: comparePassword(), getSignedJwtToken()
   - Roles: student, faculty, admin

2. **Event Model** (`models/Event.js`)
   - Fields: title, description, fullDescription, date, time, venue, category, poster, organizer, eligibility, prerequisites, maxCapacity
   - Relationships: registeredUsers[] (with registration data), createdBy (User)
   - Methods: isFull()
   - Text search index on title, description, tags

3. **Club Model** (`models/Club.js`)
   - Fields: name, description, category, logo, coverImage
   - Relationships: president, vicePresident, faculty (User refs), members[], events[], gallery[], resources[], forumPosts[]
   - Virtual: memberCount

4. **LostFound Model** (`models/LostFound.js`)
   - Fields: title, description, category, type (lost/found), location, date, images[], contactName, contactPhone, contactEmail, status
   - Relationships: claims[] (with claimedBy User), postedBy (User)
   - Text search index

5. **Announcement Model** (`models/Announcement.js`)
   - Fields: title, content, type, isPinned, targetAudience, specificDepartments[], specificYears[], attachments[], expiresAt
   - Relationships: createdBy (User)
   - Auto-deactivate expired announcements

6. **Feedback Model** (`models/Feedback.js`)
   - Fields: title, description, category, priority, status, isAnonymous, rating
   - Relationships: submittedBy, assignedTo (User), responses[]
   - Text search index

### Middleware
1. **auth.js** - JWT authentication and role-based authorization
2. **upload.js** - Multer file upload configurations for images and documents
3. **errorHandler.js** - Centralized error handling

### Controllers
1. **authController.js** - Register, login, getMe, updateDetails, updatePassword, logout

2. **eventController.js** - CRUD operations, register/unregister for events

### Configuration
- **database.js** - MongoDB connection with Mongoose
- **.env** - Environment variables (PORT, MONGODB_URI, JWT_SECRET, etc.)

## 📦 Installation Steps

### 1. Install Dependencies
```bash
cd server
npm install
```

This will install:
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - Cross-origin resource sharing
- multer - File upload handling
- express-validator - Request validation
- cookie-parser - Cookie parsing
- nodemon - Development auto-restart

### 2. Setup MongoDB
Make sure MongoDB is installed and running:
```bash
# Start MongoDB (Windows)
net start MongoDB

# Or use MongoDB Compass or MongoDB Atlas
```

### 3. Configure Environment
The `.env` file is already created with default values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/klhconnect
JWT_SECRET=klhconnect_secret_key_2025_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### 4. Start Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 🔗 API Endpoints

### Authentication (`/api/auth`)
- POST `/register` - Register new user
- POST `/login` - Login user
- GET `/me` - Get current user (Protected)
- PUT `/updatedetails` - Update user details (Protected)
- PUT `/updatepassword` - Update password (Protected)
- GET `/logout` - Logout user (Protected)

### Events (`/api/events`)
- GET `/` - Get all events
- GET `/:id` - Get single event
- POST `/` - Create event (Faculty/Admin)
- PUT `/:id` - Update event (Faculty/Admin)
- DELETE `/:id` - Delete event (Faculty/Admin)
- POST `/:id/register` - Register for event (Protected)
- DELETE `/:id/register` - Unregister from event (Protected)

### Clubs (`/api/clubs`)
- GET `/` - Get all clubs
- GET `/:id` - Get single club
- POST `/` - Create club (Admin)
- PUT `/:id` - Update club (Admin)
- DELETE `/:id` - Delete club (Admin)
- POST `/:id/join` - Join club (Protected)
- POST `/:id/leave` - Leave club (Protected)
- POST `/:id/gallery` - Upload images (Protected)
- POST `/:id/resources` - Upload resource (Protected)
- POST `/:id/forum` - Post message (Protected)

### Lost & Found (`/api/lost-found`)
- GET `/` - Get all items
- GET `/:id` - Get single item
- POST `/` - Report item (Protected)
- PUT `/:id` - Update item (Protected)
- DELETE `/:id` - Delete item (Protected)
- POST `/:id/claim` - Claim item (Protected)

### Announcements (`/api/announcements`)
- GET `/` - Get all announcements
- GET `/:id` - Get single announcement
- POST `/` - Create announcement (Faculty/Admin)
- PUT `/:id` - Update announcement (Faculty/Admin)
- DELETE `/:id` - Delete announcement (Faculty/Admin)

### Feedback (`/api/feedback`)
- GET `/` - Get all feedback (Faculty/Admin)
- GET `/my` - Get user's feedback (Protected)
- GET `/:id` - Get single feedback
- POST `/` - Submit feedback (Protected)
- PUT `/:id` - Update feedback status (Faculty/Admin)
- POST `/:id/respond` - Respond to feedback (Faculty/Admin)

## 🗄️ Database Relationships

### User Relationships
- User → registeredClubs[] (Many-to-Many with Club)
- User → registeredEvents[] (Many-to-Many with Event)
- User ← Events (One-to-Many as createdBy)
- User ← LostFound (One-to-Many as postedBy)
- User ← Announcements (One-to-Many as createdBy)
- User ← Feedback (One-to-Many as submittedBy)

### Event Relationships
- Event → registeredUsers[] (embedded with User ref)
- Event → createdBy (User)

### Club Relationships
- Club → president, vicePresident, faculty (User refs)
- Club → members[] (embedded with User ref)
- Club → gallery[] (embedded with uploadedBy User ref)
- Club → resources[] (embedded with uploadedBy User ref)
- Club → forumPosts[] (embedded with User ref)

### LostFound Relationships
- LostFound → postedBy (User)
- LostFound → claims[] (embedded with claimedBy User ref)

### Announcement Relationships
- Announcement → createdBy (User)

### Feedback Relationships
- Feedback → submittedBy (User)
- Feedback → assignedTo (User)
- Feedback → responses[] (embedded with respondedBy User ref)

## 📁 File Upload Structure

```
server/
└── uploads/
    ├── events/         # Event posters
    ├── clubs/          # Club images (gallery)
    ├── lost-found/     # Lost & found item images
    ├── profiles/       # User profile pictures
    └── resources/      # Club resources (documents)
```

### Upload Limits
- Images: 5MB max
- Documents: 10MB max
- Gallery: Max 10 images per upload
- Lost & Found: Max 5 images per item

## 🔐 Authentication Flow

1. User registers/logs in
2. Server generates JWT token
3. Token sent in response and stored in httpOnly cookie
4. Client includes token in Authorization header: `Bearer <token>`
5. Protected routes verify token via `protect` middleware
6. Role-based routes check permissions via `authorize` middleware

## 🚀 Next Steps

### Complete Remaining Controllers
You need to create controllers for:
1. `clubController.js`
2. `lostFoundController.js`
3. `announcementController.js`
4. `feedbackController.js`
5. `userController.js`

### Create All Routes
You need to create route files for:
1. `authRoutes.js` ✅ (Pattern provided)
2. `eventRoutes.js`
3. `clubRoutes.js`
4. `lostFoundRoutes.js`
5. `announcementRoutes.js`
6. `feedbackRoutes.js`
7. `userRoutes.js`

### Testing
1. Use Postman or Thunder Client to test API endpoints
2. Test authentication flow
3. Test file uploads
4. Test role-based access control

### Integration with Frontend
1. Update frontend API base URL to `http://localhost:5000/api`
2. Include JWT token in requests
3. Handle file uploads with FormData
4. Update mock data calls with real API calls

## 📝 Example API Calls

### Register User
```javascript
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
```javascript
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@klh.edu.in",
  "password": "password123"
}
```

### Create Event (with token)
```javascript
POST http://localhost:5000/api/events
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Tech Fest 2025",
  "description": "Annual technology festival",
  "date": "2025-11-15",
  "time": "10:00 AM",
  "venue": "Main Auditorium",
  "category": "Technical",
  "maxCapacity": 500,
  "organizer": "Tech Club",
  "organizerContact": "techclub@klh.edu.in"
}
```

## ✅ What's Complete

- ✅ Project structure
- ✅ Package.json with dependencies
- ✅ Environment configuration
- ✅ Database connection
- ✅ All 6 MongoDB models with relationships
- ✅ Authentication middleware
- ✅ File upload middleware
- ✅ Error handling middleware
- ✅ Auth controller (complete)
- ✅ Event controller (complete)
- ✅ Main server file
- ✅ Upload directories created

## 🔨 What Needs to be Done

1. Create remaining 4 controllers (Club, LostFound, Announcement, Feedback, User)
2. Create all 7 route files
3. Install npm packages
4. Start MongoDB
5. Test API endpoints
6. Integrate with frontend

---

**Backend foundation is complete! Ready for controller and route implementation.** 🎉
