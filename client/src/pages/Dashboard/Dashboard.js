import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import { 
  Calendar, Search, Users, MessageSquare, Bell, 
  TrendingUp, Clock, MapPin, ChevronRight 
} from 'lucide-react';
import api from '../../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    lostItems: 0,
    clubs: 0,
    announcements: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentLostItems, setRecentLostItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard data from API
      const [eventsRes, lostItemsRes, announcementsRes] = await Promise.all([
        api.get('/events?limit=3'),
        api.get('/lost-found?limit=3'),
        api.get('/announcements?limit=3'),
      ]);

      setRecentEvents(eventsRes.data.events || []);
      setRecentLostItems(lostItemsRes.data.items || []);
      setAnnouncements(announcementsRes.data.announcements || []);
      
      setStats({
        upcomingEvents: eventsRes.data.total || 0,
        lostItems: lostItemsRes.data.total || 0,
        clubs: 12, // This would come from API
        announcements: announcementsRes.data.total || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      title: 'Browse Events', 
      icon: Calendar, 
      path: '/events', 
      color: 'from-blue-500 to-blue-600',
      description: 'Discover campus events'
    },
    { 
      title: 'Lost & Found', 
      icon: Search, 
      path: '/lost-found', 
      color: 'from-purple-500 to-purple-600',
      description: 'Report or find items'
    },
    { 
      title: 'Join Clubs', 
      icon: Users, 
      path: '/clubs', 
      color: 'from-green-500 to-green-600',
      description: 'Connect with clubs'
    },
    { 
      title: 'Give Feedback', 
      icon: MessageSquare, 
      path: '/feedback', 
      color: 'from-orange-500 to-orange-600',
      description: 'Share your thoughts'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening on campus today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.upcomingEvents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span>5 this week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Lost Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.lostItems}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Search className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              <span>Updated today</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Clubs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.clubs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <span>Join new clubs</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Announcements</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.announcements}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <span>2 new today</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.path}
                  to={action.path}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
              <Link to="/events" className="text-primary hover:text-secondary text-sm font-medium flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div key={event._id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <MapPin size={14} className="ml-3 mr-1" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Recent Lost Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Lost Items</h2>
              <Link to="/lost-found" className="text-primary hover:text-secondary text-sm font-medium flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentLostItems.length > 0 ? (
                recentLostItems.map((item) => (
                  <div key={item._id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.itemName}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{item.location}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent items</p>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Latest Announcements</h2>
              <Link to="/announcements" className="text-primary hover:text-secondary text-sm font-medium flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="p-4 bg-blue-50 border-l-4 border-primary rounded">
                  <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
