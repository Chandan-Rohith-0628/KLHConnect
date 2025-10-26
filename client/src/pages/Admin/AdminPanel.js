import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { 
  Users, Calendar, Search, MessageSquare, Bell, 
  Shield, CheckCircle, XCircle, Clock, TrendingUp 
} from 'lucide-react';
import api from '../../utils/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingLostItems: 0,
    pendingFeedbacks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data
      setStats({
        totalUsers: 1250,
        totalEvents: 45,
        pendingLostItems: 12,
        pendingFeedbacks: 8,
      });
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="text-primary" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage campus ecosystem</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span>+12% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-1" />
              <span>5 upcoming</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingLostItems}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Search className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <span>Needs approval</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Feedbacks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingFeedbacks}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <span>Requires action</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {['overview', 'users', 'events', 'lost-found', 'feedback', 'announcements'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'lost-found' && <LostFoundTab />}
            {activeTab === 'feedback' && <FeedbackTab />}
            {activeTab === 'announcements' && <AnnouncementsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <p className="text-sm text-gray-700">New event "Tech Fest 2025" created by Faculty</p>
        <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <p className="text-sm text-gray-700">Lost item reported: Black Smartphone</p>
        <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
        <p className="text-sm text-gray-700">New feedback submitted: Library AC issue</p>
        <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
      </div>
    </div>
  </div>
);

// Users Tab
const UsersTab = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@klh.edu', role: 'student', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@klh.edu', role: 'faculty', status: 'active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@klh.edu', role: 'student', status: 'active' },
  ]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:text-secondary text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Events Tab
const EventsTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Management</h3>
    <p className="text-gray-600">Manage all campus events, approve or reject event requests.</p>
  </div>
);

// Lost & Found Tab
const LostFoundTab = () => {
  const [items, setItems] = useState([
    { id: 1, itemName: 'Black Smartphone', status: 'pending', reportedBy: 'John Doe' },
    { id: 2, itemName: 'Blue Backpack', status: 'pending', reportedBy: 'Jane Smith' },
  ]);

  const handleApprove = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, status: 'approved' } : item));
  };

  const handleReject = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lost & Found Approvals</h3>
      <div className="space-y-3">
        {items.filter(item => item.status === 'pending').map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
              <p className="text-sm text-gray-600">Reported by: {item.reportedBy}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(item.id)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center"
              >
                <CheckCircle size={16} className="mr-1" />
                Approve
              </button>
              <button
                onClick={() => handleReject(item.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center"
              >
                <XCircle size={16} className="mr-1" />
                Reject
              </button>
            </div>
          </div>
        ))}
        {items.filter(item => item.status === 'pending').length === 0 && (
          <p className="text-center text-gray-500 py-8">No pending items</p>
        )}
      </div>
    </div>
  );
};

// Feedback Tab
const FeedbackTab = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Management</h3>
    <p className="text-gray-600">Review and respond to student feedback and grievances.</p>
  </div>
);

// Announcements Tab
const AnnouncementsTab = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    isPinned: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      alert('Announcement posted successfully!');
      setFormData({ title: '', content: '', type: 'general', isPinned: false });
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert('Failed to post announcement');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Announcement</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="general">General</option>
              <option value="emergency">Emergency</option>
              <option value="placement">Placement</option>
              <option value="exam">Exam</option>
              <option value="hostel">Hostel</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Pin this announcement</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
        >
          <Bell size={20} className="mr-2" />
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
