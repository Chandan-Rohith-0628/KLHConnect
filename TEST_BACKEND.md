# 🧪 Test Your Backend Server

## ✅ Backend Server is Running!

Your server is successfully running on **http://localhost:5000**

---

## 🔍 Quick Tests

### Test 1: Health Check (Browser)
Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "KLHConnect API is running",
  "timestamp": "2025-10-25T..."
}
```

---

## 🧪 Test with Postman/Thunder Client

### Test 2: Register a User

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/register`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**
```json
{
  "name": "Test Student",
  "email": "test@klh.edu.in",
  "password": "password123",
  "studentId": "2021001",
  "role": "student",
  "department": "CSE",
  "year": 3,
  "phone": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test Student",
    "email": "test@klh.edu.in",
    "role": "student",
    "department": "CSE",
    "year": 3
  }
}
```

### Test 3: Verify in MongoDB Compass

1. Go to MongoDB Compass
2. Click on `klhconnect` database
3. Click on `users` collection
4. Click **Refresh** button
5. You should see your registered user!

### Test 4: Login

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/login`  
**Headers:** `Content-Type: application/json`  
**Body (JSON):**
```json
{
  "email": "test@klh.edu.in",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test Student",
    "email": "test@klh.edu.in",
    "role": "student"
  }
}
```

### Test 5: Get Current User (Protected Route)

**Method:** GET  
**URL:** `http://localhost:5000/api/auth/me`  
**Headers:**
```
Authorization: Bearer <paste_your_token_here>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test Student",
    "email": "test@klh.edu.in",
    "role": "student",
    "department": "CSE",
    "year": 3,
    "registeredClubs": [],
    "registeredEvents": []
  }
}
```

---

## 🎯 Next Step: Start Frontend

Now that backend is running, start the frontend:

```bash
# Open a NEW terminal (keep backend running)
cd client
npm start
```

Frontend will open at: **http://localhost:3000**

---

## ✅ Success Checklist

- [x] MongoDB Compass connected
- [x] Database `klhconnect` created
- [x] Collection `users` created
- [x] Backend dependencies installed
- [x] Backend server running on port 5000
- [ ] Test API with browser/Postman
- [ ] Register a user
- [ ] Verify user in MongoDB Compass
- [ ] Start frontend
- [ ] Test full application

---

## 🔧 If You Need to Stop/Restart Server

### Stop Server:
- Press `Ctrl + C` in the terminal where server is running

### Restart Server:
```bash
cd server
npm run dev
```

---

## 📝 Server Logs

Your server is running with nodemon, which means:
- ✅ Auto-restarts on file changes
- ✅ Shows all API requests in terminal
- ✅ Shows errors and warnings

Watch the terminal for logs when you make API calls!

---

**Backend is ready! Test it and then start the frontend!** 🚀
