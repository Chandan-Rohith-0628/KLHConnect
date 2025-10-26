# 🚀 KLHConnect - Quick Start Guide

## Complete Setup in 5 Minutes

### ✅ Prerequisites
- ✅ Node.js installed
- ✅ MongoDB Compass installed
- ✅ Frontend and Backend code ready

---

## 📊 Step 1: Setup MongoDB Database (2 minutes)

### Open MongoDB Compass
1. Launch **MongoDB Compass** application
2. Click **"Connect"** (uses default: `mongodb://localhost:27017`)
3. Click **"Create Database"** button
4. Enter:
   - Database Name: `klhconnect`
   - Collection Name: `users`
5. Click **"Create Database"**

✅ **Done!** Database is ready.

---

## 🔧 Step 2: Setup Backend (2 minutes)

### Install Dependencies
```bash
cd server
npm install
```

### Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: klhconnect
🚀 Server running in development mode on port 5000
```

✅ **Done!** Backend is running on `http://localhost:5000`

---

## 🎨 Step 3: Setup Frontend (1 minute)

### Install Dependencies (if not already done)
```bash
cd client
npm install
```

### Start Frontend
```bash
npm start
```

Frontend will open at: `http://localhost:3000`

✅ **Done!** Frontend is running.

---

## 🧪 Step 4: Test the Application

### 1. Register a User
1. Go to `http://localhost:3000`
2. Click **"Sign up"**
3. Fill in the registration form:
   - Name: Your Name
   - Email: your@klh.edu.in
   - Student ID: 2021001
   - Role: Student
   - Department: CSE
   - Year: 3
   - Password: password123
4. Click **"Sign up"**

### 2. Verify in MongoDB Compass
1. Go back to MongoDB Compass
2. Click on `klhconnect` database
3. Click on `users` collection
4. Click **Refresh** icon
5. You should see your registered user!

### 3. Login
1. Go to login page
2. Enter your email and password
3. Click **"Log in"**
4. You should be redirected to the dashboard!

✅ **Success!** Everything is working.

---

## 📁 Project Structure

```
KLHConnect/
├── client/                 # Frontend (React)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB models
│   ├── controllers/       # Business logic
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & upload
│   ├── uploads/          # File storage
│   ├── .env              # Environment config
│   └── server.js         # Main server file
│
└── Documentation files
```

---

## 🔗 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | ✅ Running |
| Backend API | http://localhost:5000 | ✅ Running |
| API Health | http://localhost:5000/api/health | ✅ Test endpoint |
| MongoDB | localhost:27017 | ✅ Via Compass |

---

## 🎯 Quick Test Checklist

- [ ] MongoDB Compass connected
- [ ] Database `klhconnect` created
- [ ] Backend server running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Can register a user
- [ ] User appears in MongoDB Compass
- [ ] Can login successfully
- [ ] Dashboard loads

---

## 🧪 Testing API with Postman/Thunder Client

### 1. Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@klh.edu.in",
  "password": "password123",
  "studentId": "2021001",
  "role": "student",
  "department": "CSE",
  "year": 3,
  "phone": "9876543210"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@klh.edu.in",
  "password": "password123"
}
```

### 3. Get Current User (use token from login)
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your_token_here>
```

---

## 🎨 Frontend Features to Test

### 1. **Dashboard**
- View overview cards
- See recent activities

### 2. **Events**
- View all events
- Click "View Details"
- Register for an event (fill the form)
- See "Registered" status

### 3. **Clubs**
- View all clubs
- Join a club
- Go to club detail page
- Upload images in gallery
- Upload resources
- Post in forum

### 4. **Lost & Found**
- Report a lost item (with images)
- Report a found item
- Claim an item

### 5. **Announcements**
- View announcements
- **Faculty/Admin**: Create announcement

### 6. **Feedback**
- Submit feedback
- View your feedback status

---

## 🔐 Test Users

### Student Account
```
Email: student@klh.edu.in
Password: password123
Role: Student
```

### Faculty Account
```
Email: faculty@klh.edu.in
Password: password123
Role: Faculty
```

### Admin Account
```
Email: admin@klh.edu.in
Password: password123
Role: Admin
```

**Note:** Create these via registration or API

---

## 📊 Viewing Data in MongoDB Compass

### After Using Features:

1. **Users Collection**
   - All registered users
   - Passwords are hashed
   - See registeredClubs and registeredEvents

2. **Events Collection**
   - All created events
   - Registration data embedded
   - See who registered

3. **Clubs Collection**
   - All clubs
   - Members list
   - Gallery images
   - Resources
   - Forum posts

4. **LostFounds Collection**
   - Lost and found items
   - Images
   - Claims

5. **Announcements Collection**
   - All announcements
   - Pinned status
   - Created by info

6. **Feedbacks Collection**
   - All feedback submissions
   - Status tracking
   - Responses

---

## 🛠️ Troubleshooting

### Backend won't start?
```bash
# Check if MongoDB is running
# Open MongoDB Compass and connect

# Check .env file
# Should have: MONGODB_URI=mongodb://localhost:27017/klhconnect

# Reinstall dependencies
cd server
rm -rf node_modules
npm install
```

### Frontend won't start?
```bash
cd client
rm -rf node_modules
npm install
npm start
```

### Can't connect to database?
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or check in Services (Win + R, type "services.msc")
# Find "MongoDB" and start it
```

### Port already in use?
```bash
# Backend (port 5000)
# Kill process using port 5000

# Frontend (port 3000)
# Kill process using port 3000
```

---

## 📝 Environment Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/klhconnect
JWT_SECRET=klhconnect_secret_key_2025_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

### Frontend (if needed)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎉 You're Ready!

### What You Can Do Now:

1. ✅ **Register and Login** - User authentication works
2. ✅ **Create Events** - Faculty/Admin can create events
3. ✅ **Register for Events** - Students can register with form
4. ✅ **Join Clubs** - Students can join clubs
5. ✅ **Upload Images** - Gallery images in clubs
6. ✅ **Upload Resources** - Documents in clubs
7. ✅ **Lost & Found** - Report and claim items
8. ✅ **Announcements** - Faculty/Admin can post
9. ✅ **Feedback** - Submit and track feedback
10. ✅ **View Data** - See everything in MongoDB Compass

---

## 📚 Documentation

- **Backend API**: `server/README.md`
- **MongoDB Setup**: `server/MONGODB_COMPASS_SETUP.md`
- **Frontend Features**: `UPDATES_SUMMARY.md`
- **Complete Guide**: `BACKEND_COMPLETE.md`

---

## 🚀 Next Steps

1. **Test all features** in the frontend
2. **View data** in MongoDB Compass after each action
3. **Test API endpoints** with Postman
4. **Add sample data** for better testing
5. **Customize** as needed

---

## 💡 Pro Tips

1. **Keep MongoDB Compass open** - Refresh to see data changes in real-time
2. **Use MongoDB Compass filters** - Query data easily
3. **Export collections** - Backup your data
4. **Check server logs** - See API calls in terminal
5. **Use browser DevTools** - Check network requests

---

**Everything is set up and ready to go! Start exploring KLHConnect! 🎉**
