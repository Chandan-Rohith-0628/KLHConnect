# KLHConnect Backend API

Complete REST API for KLHConnect - Smart Campus Ecosystem

## ✅ Complete Backend Structure

### 📦 Installation

```bash
cd server
npm install
```

### 🚀 Start Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server runs on: **http://localhost:5000**

---

## 📊 Database Models

### 1. User Model
- **Fields**: name, email, password, studentId, role, department, year, phone, profilePicture, bio
- **Relationships**: registeredClubs[], registeredEvents[]
- **Roles**: student, faculty, admin
- **Methods**: comparePassword(), getSignedJwtToken()

### 2. Event Model
- **Fields**: title, description, fullDescription, date, time, venue, category, poster, organizer, eligibility, prerequisites, maxCapacity, registrationDeadline
- **Relationships**: registeredUsers[] (with registration data), createdBy (User)
- **Methods**: isFull()

### 3. Club Model
- **Fields**: name, description, category, logo, coverImage
- **Relationships**: president, vicePresident, faculty (User), members[], events[], gallery[], resources[], forumPosts[]
- **Virtual**: memberCount

### 4. LostFound Model
- **Fields**: title, description, category, type (lost/found), location, date, images[], contactName, contactPhone, status
- **Relationships**: claims[] (with claimedBy User), postedBy (User)

### 5. Announcement Model
- **Fields**: title, content, type, isPinned, targetAudience, specificDepartments[], specificYears[], expiresAt
- **Relationships**: createdBy (User)

### 6. Feedback Model
- **Fields**: title, description, category, priority, status, isAnonymous, rating
- **Relationships**: submittedBy, assignedTo (User), responses[]

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Private | Get current user |
| PUT | `/updatedetails` | Private | Update user details |
| PUT | `/updatepassword` | Private | Update password |
| GET | `/logout` | Private | Logout user |

### Events (`/api/events`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all events |
| GET | `/:id` | Public | Get single event |
| POST | `/` | Faculty/Admin | Create event |
| PUT | `/:id` | Faculty/Admin | Update event |
| DELETE | `/:id` | Faculty/Admin | Delete event |
| POST | `/:id/register` | Private | Register for event |
| DELETE | `/:id/register` | Private | Unregister from event |

### Clubs (`/api/clubs`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all clubs |
| GET | `/:id` | Public | Get single club |
| POST | `/` | Admin | Create club |
| PUT | `/:id` | Admin | Update club |
| DELETE | `/:id` | Admin | Delete club |
| POST | `/:id/join` | Private | Join club |
| POST | `/:id/leave` | Private | Leave club |
| POST | `/:id/gallery` | Private | Upload images |
| POST | `/:id/resources` | Private | Upload resource |
| POST | `/:id/forum` | Private | Post message |
| GET | `/:id/members` | Admin | Get members |

### Lost & Found (`/api/lost-found`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all items |
| GET | `/:id` | Public | Get single item |
| POST | `/` | Private | Report item |
| PUT | `/:id` | Private | Update item |
| DELETE | `/:id` | Private | Delete item |
| POST | `/:id/claim` | Private | Claim item |
| PUT | `/:id/claim/:claimId` | Admin | Update claim status |

### Announcements (`/api/announcements`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all announcements |
| GET | `/:id` | Public | Get single announcement |
| POST | `/` | Faculty/Admin | Create announcement |
| PUT | `/:id` | Faculty/Admin | Update announcement |
| DELETE | `/:id` | Faculty/Admin | Delete announcement |

### Feedback (`/api/feedback`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Faculty/Admin | Get all feedback |
| GET | `/my` | Private | Get user's feedback |
| GET | `/:id` | Private | Get single feedback |
| POST | `/` | Private | Submit feedback |
| PUT | `/:id` | Faculty/Admin | Update status |
| POST | `/:id/respond` | Faculty/Admin | Respond to feedback |

### Users (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all users |
| GET | `/:id` | Private | Get single user |
| PUT | `/:id` | Private | Update user |
| DELETE | `/:id` | Admin | Delete user |
| POST | `/upload-profile` | Private | Upload profile picture |

---

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
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
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@klh.edu.in",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@klh.edu.in",
    "role": "student",
    "department": "CSE",
    "year": 3
  }
}
```

### Using Token in Requests
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📤 File Uploads

### Upload Event Poster
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: multipart/form-data

poster: <file>
title: "Tech Fest 2025"
description: "Annual technology festival"
date: "2025-11-15"
time: "10:00 AM"
venue: "Main Auditorium"
category: "Technical"
maxCapacity: 500
```

### Upload Club Images
```http
POST /api/clubs/:id/gallery
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: <file1>, <file2>, <file3>
caption: "Club Activity"
```

### Upload Club Resource
```http
POST /api/clubs/:id/resources
Authorization: Bearer <token>
Content-Type: multipart/form-data

resource: <file>
name: "Meeting Notes"
```

### Upload Lost & Found Images
```http
POST /api/lost-found
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: <file1>, <file2>
title: "Lost Laptop"
description: "Black Dell laptop"
category: "Electronics"
type: "lost"
location: "Library"
contactName: "John Doe"
contactPhone: "9876543210"
```

---

## 🗄️ Database Relationships

```
User
├── registeredClubs[] → Club
├── registeredEvents[] → Event
└── Created:
    ├── Events
    ├── LostFound items
    ├── Announcements
    └── Feedback

Event
├── createdBy → User
└── registeredUsers[] → User (with registration data)

Club
├── president → User
├── vicePresident → User
├── faculty → User
├── members[] → User
├── gallery[] (uploadedBy → User)
├── resources[] (uploadedBy → User)
└── forumPosts[] (user → User)

LostFound
├── postedBy → User
└── claims[] (claimedBy → User)

Announcement
└── createdBy → User

Feedback
├── submittedBy → User
├── assignedTo → User
└── responses[] (respondedBy → User)
```

---

## 📁 File Upload Limits

- **Images**: 5MB max
- **Documents**: 10MB max
- **Gallery**: Max 10 images per upload
- **Lost & Found**: Max 5 images per item
- **Profile Picture**: 2.5MB max

**Supported Formats:**
- Images: jpeg, jpg, png, gif, webp
- Documents: pdf, doc, docx, ppt, pptx, xls, xlsx

---

## 🔒 Role-Based Access Control

### Admin
- Full access to all endpoints
- Can create/edit/delete clubs
- Can manage users
- Can update claim status
- Can view all feedback

### Faculty
- Can create/edit/delete events
- Can create/edit/delete announcements
- Can view and respond to feedback
- Can join clubs
- Standard user permissions

### Student
- Can register for events
- Can join clubs
- Can upload club resources and images
- Can report lost/found items
- Can submit feedback
- Can claim items

---

## 🧪 Testing with Postman/Thunder Client

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
```

### 3. Copy the token from response

### 4. Test Protected Routes
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token>
```

### 5. Create an Event (Faculty/Admin)
```
POST http://localhost:5000/api/events
Authorization: Bearer <your_token>
```

---

## 🌐 Frontend Integration

### Update API Configuration
```javascript
// client/src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### File Upload Example
```javascript
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);
formData.append('caption', 'Club Activity');

await api.post(`/clubs/${clubId}/gallery`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## ✅ Complete Features

- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ File uploads (images & documents)
- ✅ Event management with registration
- ✅ Club management with members, gallery, resources, forum
- ✅ Lost & Found with claims
- ✅ Announcements with targeting
- ✅ Feedback system with responses
- ✅ User profile management
- ✅ MongoDB relationships
- ✅ Error handling
- ✅ Input validation
- ✅ Search functionality

---

## 🚀 Production Deployment

1. **Update .env for production:**
   - Change JWT_SECRET to a strong secret
   - Use MongoDB Atlas for database
   - Set NODE_ENV=production
   - Configure proper CORS origins

2. **Deploy to:**
   - Heroku
   - Railway
   - Render
   - DigitalOcean
   - AWS

3. **Enable HTTPS** for secure communication

---

**Backend is 100% complete and ready for production!** 🎉
