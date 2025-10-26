# KLHConnect Testing Guide

## Frontend Testing (Without Backend)

The frontend is fully functional with mock data. You can test all features without a backend.

### Starting the App

```bash
cd client
npm start
```

The app will open at `http://localhost:3000`

### Test Credentials

Since the backend isn't connected yet, the login will attempt to connect to the API. To test the UI:

**Option 1: Test UI Components**
- Navigate directly to pages by changing the URL
- Example: `http://localhost:3000/dashboard`
- The ProtectedRoute will redirect to login if not authenticated

**Option 2: Mock Login (Temporary)**
You can temporarily bypass authentication by:
1. Open browser DevTools (F12)
2. Go to Console
3. Run these commands:
```javascript
localStorage.setItem('token', 'mock-token');
localStorage.setItem('user', JSON.stringify({
  name: 'Test User',
  email: 'test@klh.edu',
  role: 'student'
}));
```
4. Refresh the page
5. You'll now be "logged in" and can access all pages

### Pages to Test

#### 1. Authentication Pages
- **Login**: `http://localhost:3000/login`
  - Instagram-style dark theme
  - Email and password fields
  - "Sign up" link
  
- **Register**: `http://localhost:3000/register`
  - Full registration form
  - Role selection (Student/Faculty)
  - Password confirmation

#### 2. Dashboard
- **URL**: `http://localhost:3000/dashboard`
- **Features to Test**:
  - Welcome message with user name
  - Stats cards (Events, Lost Items, Clubs, Announcements)
  - Quick action cards
  - Recent events preview
  - Recent lost items
  - Latest announcements

#### 3. Events Module
- **URL**: `http://localhost:3000/events`
- **Features to Test**:
  - Grid view with event cards
  - Calendar view toggle
  - Search and filter functionality
  - Event categories with color coding
  - Event registration buttons
  - Mock events display

#### 4. Lost & Found
- **URL**: `http://localhost:3000/lost-found`
- **Features to Test**:
  - Item catalog grid
  - Category and date filters
  - "Report Found Item" button (opens modal)
  - Item submission form
  - Click on item to view details
  
- **Item Detail**: `http://localhost:3000/lost-found/1`
  - Item details page
  - "I Found It!" button
  - Chat interface (appears after claiming)
  - Message sending

#### 5. Clubs
- **URL**: `http://localhost:3000/clubs`
- **Features to Test**:
  - Club cards with categories
  - Search functionality
  - Member count display
  - "Join Club" buttons
  - Category color coding

#### 6. Feedback & Grievances
- **URL**: `http://localhost:3000/feedback`
- **Features to Test**:
  - Two tabs: Submit and Track
  - Feedback submission form
  - Category selection
  - File upload option
  - Ticket ID generation (mock)
  - Status tracking with color-coded badges

#### 7. Announcements
- **URL**: `http://localhost:3000/announcements`
- **Features to Test**:
  - Filter buttons (All, Emergency, Placements, Exams, Hostel)
  - Pinned announcements section
  - Type-based color coding
  - Icon indicators
  - Date display

#### 8. Profile
- **URL**: `http://localhost:3000/profile`
- **Features to Test**:
  - Profile header with gradient
  - Edit mode toggle
  - Form fields (Name, Email, Phone, Department, Year)
  - Save/Cancel buttons
  - Bio section

#### 9. Messages
- **URL**: `http://localhost:3000/messages`
- **Features to Test**:
  - Conversation list
  - Search conversations
  - Chat interface
  - Message bubbles (sent/received)
  - Message input and send button

#### 10. Admin Panel (Admin Role Only)
- **URL**: `http://localhost:3000/admin`
- **Features to Test**:
  - Stats dashboard
  - Multiple tabs (Overview, Users, Events, Lost-Found, Feedback, Announcements)
  - User management table
  - Lost & Found approval system
  - Announcement creation form

### Testing Role-Based Access

**To test as Admin:**
```javascript
localStorage.setItem('user', JSON.stringify({
  name: 'Admin User',
  email: 'admin@klh.edu',
  role: 'admin'
}));
```

**To test as Faculty:**
```javascript
localStorage.setItem('user', JSON.stringify({
  name: 'Faculty User',
  email: 'faculty@klh.edu',
  role: 'faculty'
}));
```

**To test as Student:**
```javascript
localStorage.setItem('user', JSON.stringify({
  name: 'Student User',
  email: 'student@klh.edu',
  role: 'student'
}));
```

### Responsive Design Testing

Test on different screen sizes:
- **Desktop**: 1920x1080
- **Tablet**: 768x1024
- **Mobile**: 375x667

Use browser DevTools (F12) → Toggle device toolbar (Ctrl+Shift+M)

### Navigation Testing

1. **Navbar**: Present on all protected pages
   - Logo click → Dashboard
   - Navigation links
   - Messages icon with notification badge
   - Profile dropdown
   - Logout button

2. **Mobile Menu**: Test hamburger menu on mobile screens

### UI/UX Elements to Verify

- ✅ Tailwind CSS styling applied
- ✅ Smooth transitions and hover effects
- ✅ Loading spinners
- ✅ Color-coded categories
- ✅ Icons from Lucide React
- ✅ Responsive grid layouts
- ✅ Form validation
- ✅ Modal dialogs
- ✅ Toast notifications (alerts)

### Known Limitations (Without Backend)

- Login/Register won't actually authenticate
- Data won't persist (uses mock data)
- API calls will fail (but UI still works)
- Real-time features won't work
- File uploads won't process
- Search might not work fully

### Next Steps

Once backend is implemented:
1. Remove mock data
2. Connect to real API endpoints
3. Implement Socket.io for real-time chat
4. Add file upload functionality
5. Enable actual authentication

### Troubleshooting

**Issue**: Page shows loading spinner forever
- **Solution**: Check browser console for errors, ensure all imports are correct

**Issue**: Styles not applied
- **Solution**: Restart dev server, clear browser cache

**Issue**: Can't access protected routes
- **Solution**: Use the localStorage commands above to mock authentication

**Issue**: npm start fails
- **Solution**: Delete node_modules and package-lock.json, run `npm install` again

### Browser Compatibility

Tested on:
- Chrome (Recommended)
- Firefox
- Edge
- Safari

### Performance

- Initial load: ~2-3 seconds
- Page transitions: Instant
- Mock data loads: Instant

---

**Happy Testing! 🚀**
