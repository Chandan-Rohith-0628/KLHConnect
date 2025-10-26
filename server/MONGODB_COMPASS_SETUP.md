# MongoDB Compass Setup Guide for KLHConnect

## 🗄️ Setting Up Database with MongoDB Compass

### Step 1: Open MongoDB Compass

1. Open **MongoDB Compass** application on your laptop
2. You should see the connection screen

### Step 2: Create New Connection

**Connection String:**
```
mongodb://localhost:27017
```

Or simply click **"Connect"** if it shows the default localhost connection.

### Step 3: Create Database

1. Once connected, click on **"Create Database"** button (or the + icon)
2. Enter the following details:
   - **Database Name:** `klhconnect`
   - **Collection Name:** `users` (we'll start with this)
3. Click **"Create Database"**

### Step 4: Verify Database Creation

You should now see `klhconnect` database in the left sidebar with the `users` collection.

### Step 5: Collections Will Be Auto-Created

When you start the server and begin using the API, MongoDB will automatically create these collections:
- ✅ `users` (already created)
- ✅ `events` (auto-created on first event)
- ✅ `clubs` (auto-created on first club)
- ✅ `lostfounds` (auto-created on first item)
- ✅ `announcements` (auto-created on first announcement)
- ✅ `feedbacks` (auto-created on first feedback)

---

## 🚀 Start the Backend Server

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Verify .env Configuration
The `.env` file should have:
```env
MONGODB_URI=mongodb://localhost:27017/klhconnect
```

### 3. Start Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: klhconnect
🚀 Server running in development mode on port 5000
```

---

## 📊 Viewing Data in MongoDB Compass

### After Creating Users (Registration)

1. In MongoDB Compass, click on `klhconnect` database
2. Click on `users` collection
3. You'll see all registered users with their data
4. You can view, edit, or delete documents directly

### Viewing Collections

Each collection will appear automatically as you use the features:

**Users Collection:**
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@klh.edu.in",
  "password": "$2a$10$...", // Hashed
  "studentId": "2021001",
  "role": "student",
  "department": "CSE",
  "year": 3,
  "phone": "9876543210",
  "registeredClubs": [],
  "registeredEvents": [],
  "isActive": true,
  "createdAt": "2025-10-25T...",
  "updatedAt": "2025-10-25T..."
}
```

**Events Collection:**
```json
{
  "_id": "ObjectId",
  "title": "Tech Fest 2025",
  "description": "Annual technology festival",
  "date": "2025-11-15T00:00:00.000Z",
  "time": "10:00 AM",
  "venue": "Main Auditorium",
  "category": "Technical",
  "maxCapacity": 500,
  "registeredUsers": [],
  "createdBy": "ObjectId(userId)",
  "createdAt": "2025-10-25T...",
  "updatedAt": "2025-10-25T..."
}
```

---

## 🧪 Testing Database Connection

### Test 1: Register a User

```bash
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

**Check in Compass:**
1. Refresh the `users` collection
2. You should see the new user document

### Test 2: Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@klh.edu.in",
  "password": "password123"
}
```

You'll receive a JWT token in the response.

---

## 🔍 Useful MongoDB Compass Features

### 1. **Schema Analysis**
- Click on "Schema" tab in any collection
- See the structure and data types of your documents

### 2. **Query Documents**
- Use the filter bar to search
- Example: `{ "role": "student" }`
- Example: `{ "department": "CSE", "year": 3 }`

### 3. **Indexes**
- Click on "Indexes" tab
- View automatically created indexes
- Text search indexes on events, clubs, etc.

### 4. **Aggregation Pipeline**
- Click on "Aggregations" tab
- Build complex queries visually

### 5. **Import/Export Data**
- Export collections to JSON/CSV
- Import sample data for testing

---

## 📝 Sample Data for Testing

### Create Admin User (Manually in Compass)

1. Go to `users` collection
2. Click "Insert Document"
3. Paste this (change password hash):

```json
{
  "name": "Admin User",
  "email": "admin@klh.edu.in",
  "password": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "department": "CSE",
  "isActive": true,
  "createdAt": {"$date": "2025-10-25T00:00:00.000Z"},
  "updatedAt": {"$date": "2025-10-25T00:00:00.000Z"}
}
```

**Note:** For password, register via API first, then copy the hashed password from another user.

### Create Sample Club

1. Go to `clubs` collection (create if doesn't exist)
2. Click "Insert Document"
3. Paste:

```json
{
  "name": "Tech Club",
  "description": "Explore technology and innovation",
  "category": "Technical",
  "members": [],
  "events": [],
  "gallery": [],
  "resources": [],
  "forumPosts": [],
  "isActive": true,
  "createdAt": {"$date": "2025-10-25T00:00:00.000Z"},
  "updatedAt": {"$date": "2025-10-25T00:00:00.000Z"}
}
```

---

## 🔧 Troubleshooting

### Issue: "MongoDB not running"

**Solution:**
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or check if MongoDB is running in Services
# Press Win + R, type "services.msc"
# Find "MongoDB" and start it
```

### Issue: "Connection refused"

**Solution:**
1. Verify MongoDB is running in Compass
2. Check connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/klhconnect
   ```
3. Restart the server

### Issue: "Database not showing in Compass"

**Solution:**
1. Click the refresh button in Compass
2. Make sure you're connected to localhost:27017
3. Create at least one document in a collection

### Issue: "Collections not appearing"

**Solution:**
- Collections are created automatically when first document is inserted
- Register a user or create an event to see collections appear
- Refresh Compass after API calls

---

## 📊 Monitoring Your Database

### Check Database Size
1. Click on `klhconnect` database
2. See storage size and document count

### View Recent Activity
1. Click on any collection
2. Sort by `createdAt` descending
3. See most recent documents

### Search Documents
Use filters in Compass:
```javascript
// Find all students in CSE
{ "role": "student", "department": "CSE" }

// Find events in November
{ "date": { "$gte": "2025-11-01", "$lt": "2025-12-01" } }

// Find active announcements
{ "isActive": true, "isPinned": true }
```

---

## 🎯 Quick Start Checklist

- [ ] Open MongoDB Compass
- [ ] Connect to `mongodb://localhost:27017`
- [ ] Create database `klhconnect`
- [ ] Create collection `users`
- [ ] Navigate to `server` folder
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] See "MongoDB Connected" message
- [ ] Register a user via API
- [ ] Check user appears in Compass
- [ ] Test other endpoints

---

## 📱 MongoDB Compass Tips

### 1. **Favorite Connections**
- Save your localhost connection as favorite
- Quick access for future sessions

### 2. **Query History**
- Compass saves your recent queries
- Reuse common filters

### 3. **Export for Backup**
- Export collections before major changes
- Keep backups of important data

### 4. **Performance Tab**
- Monitor slow queries
- Optimize database performance

---

## 🌐 Connection String Explained

```
mongodb://localhost:27017/klhconnect
```

- `mongodb://` - Protocol
- `localhost` - Host (your computer)
- `27017` - Default MongoDB port
- `klhconnect` - Database name

---

## ✅ Verification Steps

### 1. MongoDB is Running
```bash
# Check in Compass - should show "Connected"
```

### 2. Server Connects to Database
```bash
# Start server and see:
✅ MongoDB Connected: localhost
📊 Database: klhconnect
```

### 3. Collections Are Created
```bash
# After API usage, refresh Compass
# Should see: users, events, clubs, etc.
```

### 4. Data is Stored
```bash
# Register a user
# Check in Compass users collection
# Document should appear
```

---

## 🎉 You're All Set!

Your MongoDB Compass is now configured for KLHConnect!

**Next Steps:**
1. Start the backend server: `npm run dev`
2. Test API endpoints with Postman/Thunder Client
3. View data in MongoDB Compass
4. Integrate with frontend

---

**MongoDB Compass + KLHConnect Backend = Ready to Go! 🚀**
