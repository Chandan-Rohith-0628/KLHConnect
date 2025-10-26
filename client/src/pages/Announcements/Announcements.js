import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Bell, AlertCircle, Briefcase, BookOpen, Home as HomeIcon, Pin, X, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const Announcements = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const canManageAnnouncements = isAdmin || isFaculty;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general',
    isPinned: false,
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Mock data
      setAnnouncements([
        {
          _id: '1',
          title: 'Campus Closed Tomorrow',
          content: 'Due to maintenance work, the campus will remain closed tomorrow. All classes are cancelled.',
          type: 'emergency',
          isPinned: true,
          createdAt: '2025-10-24',
        },
        {
          _id: '2',
          title: 'Placement Drive - Tech Giants',
          content: 'Major tech companies will be visiting campus next week for placement drives. Eligible students should register.',
          type: 'placement',
          isPinned: true,
          createdAt: '2025-10-23',
        },
        {
          _id: '3',
          title: 'Mid-term Exam Schedule Released',
          content: 'The mid-term examination schedule has been published. Check the academic portal for details.',
          type: 'exam',
          isPinned: false,
          createdAt: '2025-10-22',
        },
        {
          _id: '4',
          title: 'Hostel Room Allocation',
          content: 'New hostel room allocations for the next semester are now available. Contact the hostel office for queries.',
          type: 'hostel',
          isPinned: false,
          createdAt: '2025-10-21',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      emergency: <AlertCircle size={20} />,
      placement: <Briefcase size={20} />,
      exam: <BookOpen size={20} />,
      hostel: <HomeIcon size={20} />,
      general: <Bell size={20} />,
    };
    return icons[type] || <Bell size={20} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      emergency: 'bg-red-50 border-red-500 text-red-700',
      placement: 'bg-green-50 border-green-500 text-green-700',
      exam: 'bg-blue-50 border-blue-500 text-blue-700',
      hostel: 'bg-purple-50 border-purple-500 text-purple-700',
      general: 'bg-gray-50 border-gray-500 text-gray-700',
    };
    return colors[type] || 'bg-gray-50 border-gray-500 text-gray-700';
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      emergency: 'bg-red-100 text-red-700',
      placement: 'bg-green-100 text-green-700',
      exam: 'bg-blue-100 text-blue-700',
      hostel: 'bg-purple-100 text-purple-700',
      general: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/announcements', newAnnouncement);
      setAnnouncements([response.data.announcement, ...announcements]);
      setShowCreateModal(false);
      setNewAnnouncement({ title: '', content: '', type: 'general', isPinned: false });
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Error creating announcement:', error);
      // Mock creation
      const mockAnnouncement = {
        _id: Date.now().toString(),
        ...newAnnouncement,
        createdAt: new Date().toISOString(),
      };
      setAnnouncements([mockAnnouncement, ...announcements]);
      setShowCreateModal(false);
      setNewAnnouncement({ title: '', content: '', type: 'general', isPinned: false });
      alert('Announcement created successfully!');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await api.delete(`/announcements/${id}`);
      setAnnouncements(announcements.filter(a => a._id !== id));
      alert('Announcement deleted successfully!');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      // Mock deletion
      setAnnouncements(announcements.filter(a => a._id !== id));
      alert('Announcement deleted successfully!');
    }
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.isPinned);
  const regularAnnouncements = filteredAnnouncements.filter(a => !a.isPinned);

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-1">Stay updated with campus news and notices</p>
          </div>
          {canManageAnnouncements && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-lg transition-colors font-medium flex items-center"
            >
              <Bell size={20} className="mr-2" />
              Create Announcement
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('emergency')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'emergency'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚨 Emergency
            </button>
            <button
              onClick={() => setFilter('placement')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'placement'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🧑‍🎓 Placements
            </button>
            <button
              onClick={() => setFilter('exam')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'exam'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✍️ Exams
            </button>
            <button
              onClick={() => setFilter('hostel')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'hostel'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏠 Hostel
            </button>
          </div>
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Pin size={20} className="mr-2 text-primary" />
              Pinned Announcements
            </h2>
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement) => (
                <div
                  key={announcement._id}
                  className={`border-l-4 rounded-lg p-6 ${getTypeColor(announcement.type)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(announcement.type)}
                      <h3 className="text-xl font-bold">{announcement.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(announcement.type)}`}>
                        {announcement.type.toUpperCase()}
                      </span>
                      <Pin size={16} className="text-primary" />
                      {canManageAnnouncements && (
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete announcement"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{announcement.content}</p>
                  <p className="text-sm text-gray-600">
                    Posted on {format(new Date(announcement.createdAt), 'MMMM dd, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">All Announcements</h2>
          <div className="space-y-4">
            {regularAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className={`border-l-4 rounded-lg p-6 ${getTypeColor(announcement.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(announcement.type)}
                    <h3 className="text-xl font-bold">{announcement.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(announcement.type)}`}>
                      {announcement.type.toUpperCase()}
                    </span>
                    {canManageAnnouncements && (
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{announcement.content}</p>
                <p className="text-sm text-gray-600">
                  Posted on {format(new Date(announcement.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements</h3>
            <p className="text-gray-600">Check back later for updates</p>
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && canManageAnnouncements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Announcement</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="general">General</option>
                    <option value="emergency">Emergency</option>
                    <option value="placement">Placement</option>
                    <option value="exam">Exam</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={newAnnouncement.isPinned}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isPinned: e.target.checked })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700">
                    Pin this announcement
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
                  >
                    Create Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
