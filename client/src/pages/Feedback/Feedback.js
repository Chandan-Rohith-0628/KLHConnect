import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

const Feedback = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const [activeTab, setActiveTab] = useState(isAdmin ? 'all' : 'submit');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
    file: null,
  });

  useEffect(() => {
    if (activeTab === 'track') {
      fetchMyFeedbacks();
    } else if (activeTab === 'all') {
      fetchAllFeedbacks();
    }
  }, [activeTab]);

  const fetchMyFeedbacks = async () => {
    try {
      const response = await api.get('/feedback/my');
      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      // Mock data
      setFeedbacks([
        {
          _id: '1',
          ticketId: 'FB-2025-001',
          subject: 'Library AC not working',
          category: 'Infrastructure',
          status: 'pending',
          createdAt: '2025-10-20',
          submittedBy: user.name,
        },
        {
          _id: '2',
          ticketId: 'FB-2025-002',
          subject: 'Need more vegetarian options in canteen',
          category: 'Hostel',
          status: 'in-progress',
          createdAt: '2025-10-18',
          submittedBy: user.name,
        },
      ]);
    }
  };

  const fetchAllFeedbacks = async () => {
    try {
      const response = await api.get('/feedback/all');
      setFeedbacks(response.data.feedbacks || []);
    } catch (error) {
      console.error('Error fetching all feedbacks:', error);
      // Mock data for admin/faculty
      setFeedbacks([
        {
          _id: '1',
          ticketId: 'FB-2025-001',
          subject: 'Library AC not working',
          category: 'Infrastructure',
          status: 'pending',
          createdAt: '2025-10-20',
          submittedBy: 'John Doe',
        },
        {
          _id: '2',
          ticketId: 'FB-2025-002',
          subject: 'Need more vegetarian options in canteen',
          category: 'Hostel',
          status: 'in-progress',
          createdAt: '2025-10-18',
          submittedBy: 'Jane Smith',
        },
        {
          _id: '3',
          ticketId: 'FB-2025-003',
          subject: 'Wi-Fi connectivity issues in hostel',
          category: 'Technical',
          status: 'resolved',
          createdAt: '2025-10-15',
          submittedBy: 'Mike Johnson',
        },
      ]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/feedback', formData);
      alert(`Feedback submitted successfully! Ticket ID: ${response.data.ticketId}`);
      setFormData({
        subject: '',
        category: '',
        description: '',
        file: null,
      });
      setActiveTab('track');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={16} />,
      'in-progress': <AlertCircle size={16} />,
      resolved: <CheckCircle size={16} />,
      rejected: <AlertCircle size={16} />,
    };
    return icons[status] || <Clock size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Feedback Management' : 'Feedback & Grievances'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin 
              ? 'View and manage all student feedback' 
              : isFaculty
              ? 'Submit and review student feedback'
              : 'Share your thoughts or report issues'}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {/* Admin sees only "All Feedback" tab */}
            {isAdmin ? (
              <button
                onClick={() => setActiveTab('all')}
                className="flex-1 px-6 py-4 text-center font-medium text-primary border-b-2 border-primary"
              >
                All Feedback
              </button>
            ) : (
              /* Faculty and Students see Submit and Track tabs */
              <>
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'submit'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Submit Feedback
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'track'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isFaculty ? 'Review Feedback' : 'Track Status'}
                </button>
                {isFaculty && (
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                      activeTab === 'all'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Feedback
                  </button>
                )}
              </>
            )}
          </div>

          {/* Submit Tab */}
          {activeTab === 'submit' && (
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your feedback"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Academics">Academics</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Transport">Transport</option>
                    <option value="Canteen">Canteen</option>
                    <option value="Library">Library</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide detailed information about your feedback or grievance"
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach File (optional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload supporting documents or images (Max 5MB)
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your identity will be kept confidential. Only authorized personnel will have access to your feedback.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Track Tab */}
          {activeTab === 'track' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isFaculty ? 'Student Feedback to Review' : 'Your Feedback History'}
              </h3>
              
              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div key={feedback._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-sm text-gray-600">{feedback.ticketId}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(feedback.status)}`}>
                              {getStatusIcon(feedback.status)}
                              <span className="capitalize">{feedback.status.replace('-', ' ')}</span>
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{feedback.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">Category: {feedback.category}</p>
                          {feedback.submittedBy && (
                            <p className="text-xs text-gray-500 mt-1">Submitted by: {feedback.submittedBy}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback submitted yet</h3>
                  <p className="text-gray-600">Submit your first feedback to see it here</p>
                </div>
              )}
            </div>
          )}

          {/* All Feedback Tab - Admin and Faculty */}
          {activeTab === 'all' && (isAdmin || isFaculty) && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                All Student Feedback
              </h3>
              
              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div key={feedback._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-sm text-gray-600">{feedback.ticketId}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(feedback.status)}`}>
                              {getStatusIcon(feedback.status)}
                              <span className="capitalize">{feedback.status.replace('-', ' ')}</span>
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{feedback.subject}</h4>
                          <p className="text-sm text-gray-600 mt-1">Category: {feedback.category}</p>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">Submitted by:</span> {feedback.submittedBy}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No feedback available</h3>
                  <p className="text-gray-600">No student feedback has been submitted yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
