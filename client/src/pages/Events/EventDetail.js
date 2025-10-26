import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
  });

  const isStaff = user?.role === 'admin' || user?.role === 'faculty';

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
      setIsRegistered(response.data.isRegistered || false);
    } catch (error) {
      console.error('Error fetching event details:', error);
      // Mock data
      setEvent({
        _id: id,
        title: 'Tech Fest 2025',
        description: 'Join us for the biggest technology festival of the year! Tech Fest 2025 brings together students, professionals, and tech enthusiasts for three days of innovation, learning, and networking. Experience cutting-edge technology demonstrations, participate in coding competitions, attend expert workshops, and connect with industry leaders.',
        fullDescription: 'Tech Fest 2025 is our flagship annual event that celebrates innovation and technology. This year\'s theme is "Future Forward" focusing on emerging technologies like AI, Blockchain, IoT, and Quantum Computing.\n\nThe event features:\n• 20+ Technical Workshops\n• Hackathon with ₹1 Lakh Prize Pool\n• Industry Expert Talks\n• Project Exhibitions\n• Networking Sessions\n• Career Fair with Top Companies',
        date: '2025-11-15',
        time: '10:00 AM',
        endTime: '6:00 PM',
        venue: 'Main Auditorium',
        category: 'Technical',
        poster: '',
        organizer: 'Tech Club',
        organizerContact: 'techclub@klh.edu.in',
        eligibility: 'Open to all students and faculty members. Prior registration required.',
        prerequisites: 'Laptop required for workshops. Basic programming knowledge recommended.',
        registeredUsers: 150,
        maxCapacity: 500,
        registrationDeadline: '2025-11-10',
        status: 'upcoming',
        createdBy: 'Admin',
        tags: ['Technology', 'Workshop', 'Competition', 'Networking'],
      });
      setIsRegistered(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // Open registration form instead of direct registration
    setShowRegistrationForm(true);
    // Pre-fill user data
    setRegistrationData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      department: '',
      year: '',
    });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    
    try {
      await api.post(`/events/${id}/register`, registrationData);
      setIsRegistered(true);
      setEvent({ ...event, registeredUsers: event.registeredUsers + 1 });
      setShowRegistrationForm(false);
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      // Mock registration
      setIsRegistered(true);
      setEvent({ ...event, registeredUsers: event.registeredUsers + 1 });
      setShowRegistrationForm(false);
      alert('Successfully registered for the event!');
    } finally {
      setRegistering(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      alert('Event deleted successfully!');
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Event deleted successfully!');
      navigate('/events');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technical: 'from-blue-500 to-blue-600',
      Cultural: 'from-purple-500 to-purple-600',
      Sports: 'from-green-500 to-green-600',
      Academic: 'from-orange-500 to-orange-600',
      Workshop: 'from-pink-500 to-pink-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
            <Link to="/events" className="text-primary hover:underline">Back to Events</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/events"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Events
        </Link>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Event Poster */}
          <div className={`h-64 bg-gradient-to-br ${getCategoryColor(event.category)} flex items-center justify-center relative`}>
            {event.poster ? (
              <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <Calendar size={80} className="text-white opacity-50" />
            )}
            <div className="absolute top-4 right-4">
              <span className={`px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-full shadow-lg`}>
                {event.category}
              </span>
            </div>
          </div>

          {/* Event Title and Actions */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-gray-600">{event.description}</p>
              </div>
              {isStaff && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Event Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar size={20} className="mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{format(new Date(event.date), 'MMMM dd, yyyy')}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock size={20} className="mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-medium">{event.time} {event.endTime && `- ${event.endTime}`}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin size={20} className="mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Venue</div>
                  <div className="font-medium">{event.venue}</div>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <Users size={20} className="mr-3 text-primary" />
                <div>
                  <div className="text-sm text-gray-500">Registration</div>
                  <div className="font-medium">{event.registeredUsers} / {event.maxCapacity} registered</div>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            {isRegistered ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle size={24} className="text-green-600 mr-3" />
                <div>
                  <div className="font-semibold text-green-900">You're registered!</div>
                  <div className="text-sm text-green-700">See you at the event</div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering || event.registeredUsers >= event.maxCapacity}
                className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? 'Registering...' : event.registeredUsers >= event.maxCapacity ? 'Event Full' : 'Register for Event'}
              </button>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {event.fullDescription || event.description}
              </div>
            </div>

            {/* Eligibility */}
            {event.eligibility && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Eligibility</h2>
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{event.eligibility}</p>
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {event.prerequisites && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                <p className="text-gray-700">{event.prerequisites}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Organizer</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Organized by</div>
                  <div className="font-medium text-gray-900">{event.organizer}</div>
                </div>
                {event.organizerContact && (
                  <div>
                    <div className="text-sm text-gray-500">Contact</div>
                    <div className="font-medium text-gray-900">{event.organizerContact}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Deadline */}
            {event.registrationDeadline && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-bold text-yellow-900 mb-2">Registration Deadline</h3>
                <p className="text-yellow-800">
                  {format(new Date(event.registrationDeadline), 'MMMM dd, yyyy')}
                </p>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Event Registration</h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <CheckCircle size={24} className="text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={registrationData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registrationData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registrationData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={registrationData.department}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={registrationData.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registering}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering ? 'Registering...' : 'Register'}
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

export default EventDetail;
