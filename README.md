# KLHConnect - Smart Campus Ecosystem

A unified digital platform for KLH University to streamline campus communication and activity management.

## Features

### Core Modules
- **Authentication System**: Role-based login (Student/Faculty/Admin) with Instagram-style UI
- **Dashboard**: Personalized dashboard with quick stats and recent activities
- **Events Management**: Create, browse, and register for campus events with calendar view
- **Lost & Found**: Report lost items, browse found items, and chat with finders
- **Clubs**: Browse campus clubs, join clubs, and view club activities
- **Feedback & Grievances**: Submit anonymous feedback and track status
- **Announcements**: View campus-wide announcements with priority filtering
- **Admin Panel**: Comprehensive management tools for admins
- **Real-time Chat**: Message system for Lost & Found claims

### Tech Stack
- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js (to be implemented)
- **Database**: MongoDB (to be implemented)
- **Real-time**: Socket.io (to be implemented)
- **Authentication**: JWT with role-based access control

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Backend Setup (Coming Soon)

Backend implementation with MongoDB, Express.js, and Socket.io will be added next.

## Project Structure

```
KLHConnect/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Layout/
│   │   │   └── ProtectedRoute.js
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Events/
│   │   │   ├── LostFound/
│   │   │   ├── Clubs/
│   │   │   ├── Feedback/
│   │   │   ├── Announcements/
│   │   │   ├── Profile/
│   │   │   ├── Messages/
│   │   │   └── Admin/
│   │   ├── utils/         # API utilities
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
└── server/                # Backend (to be implemented)
```

## User Roles

### Student
- View and register for events
- Report/claim lost items
- Join clubs
- Submit feedback
- View announcements
- Chat with other users

### Faculty
- All student permissions
- Create and manage events
- Review feedback

### Admin
- All permissions
- User management
- Approve lost & found items
- Manage all modules
- Post announcements
- Access admin panel

## Features in Detail

### Authentication
- Instagram-inspired dark theme login/register
- JWT-based authentication
- Role-based access control
- Persistent sessions

### Dashboard
- Welcome message with user name
- Quick stats cards
- Recent events preview
- Recent lost items
- Latest announcements
- Quick action shortcuts

### Events Module
- Grid and calendar view
- Filter by category and date
- Event registration
- Color-coded categories
- Faculty/Admin can create events

### Lost & Found
- Report found items with images
- Browse lost items catalog
- Filter by category and date
- "Found It" claim button
- Real-time chat between finder and owner
- Admin approval required

### Clubs
- Browse all campus clubs
- View club details
- Join clubs
- Club categorization
- Member count display

### Feedback System
- Anonymous submission
- Category-based organization
- Ticket ID generation
- Status tracking (Pending/In-Progress/Resolved)
- File attachment support

### Announcements
- Type-based filtering (Emergency/Placement/Exam/Hostel)
- Pinned announcements
- Color-coded by priority
- Admin-only posting

### Admin Panel
- Dashboard with statistics
- User management
- Event approval
- Lost & Found approvals
- Feedback management
- Announcement creation

## Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Environment Variables

Create a `.env` file in the client directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

### Frontend (Netlify/Vercel)

1. Build the app:
```bash
cd client
npm run build
```

2. Deploy the `build` folder to your hosting service

### Backend (Render)

Backend deployment instructions will be added after implementation.

## API Endpoints (To Be Implemented)

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/events
POST   /api/events
GET    /api/lost-found
POST   /api/lost-found
GET    /api/clubs
POST   /api/feedback
GET    /api/announcements
POST   /api/announcements
GET    /api/admin/stats
```

## Contributing

This is a university project. For any issues or suggestions, please contact the development team.

## License

MIT License - KLH University

## Contact

For support or queries, contact: support@klh.edu

---

**Built with ❤️ for KLH University**
