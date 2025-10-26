import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Clock, Users, Plus, Filter, Grid, List } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, filter, searchTerm]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Mock data for demo
      setEvents([
        {
          _id: '1',
          title: 'Tech Fest 2025',
          description: 'Annual technology festival with workshops and competitions',
          date: '2025-11-15',
          time: '10:00 AM',
          venue: 'Main Auditorium',
          category: 'Technical',
          poster: '',
          registeredUsers: 150,
          maxCapacity: 500,
        },
        {
          _id: '2',
          title: 'Cultural Night',
          description: 'Celebrate diversity with music, dance, and food',
          date: '2025-11-20',
          time: '6:00 PM',
          venue: 'Open Air Theatre',
          category: 'Cultural',
          poster: '',
          registeredUsers: 200,
          maxCapacity: 1000,
        },
        {
          _id: '3',
          title: 'Sports Day',
          description: 'Inter-department sports competition',
          date: '2025-11-25',
          time: '8:00 AM',
          venue: 'Sports Complex',
          category: 'Sports',
          poster: '',
          registeredUsers: 300,
          maxCapacity: 800,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by time
    const now = new Date();
    if (filter === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.date) >= now);
    } else if (filter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600 mt-1">Discover and register for campus events</p>
            </div>
            {(user?.role === 'faculty' || user?.role === 'admin') && (
              <Link
                to="/events/create"
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
              >
                <Plus size={20} className="mr-2" />
                Create Event
              </Link>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Event Poster */}
                <div className={`h-48 bg-gradient-to-br ${getCategoryColor(event.category)} flex items-center justify-center`}>
                  {event.poster ? (
                    <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <Calendar size={64} className="text-white opacity-50" />
                  )}
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white text-xs font-semibold rounded-full`}>
                      {event.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(event.date), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2" />
                      <span>{event.registeredUsers} / {event.maxCapacity} registered</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="block w-full text-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Calendar View
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Calendar View</h2>
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div key={event._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {format(new Date(event.date), 'dd')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(event.date), 'MMM')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} text-white text-xs rounded-full`}>
                        {event.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {event.time}
                      </span>
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event._id}`}
                    className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors text-sm"
                  >
                    Register
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
