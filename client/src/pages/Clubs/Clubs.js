import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { Users, UserPlus, Search, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'registered'
  const [registeredClubIds, setRegisteredClubIds] = useState(['1', '3']); // Mock registered clubs
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get('/clubs');
      setClubs(response.data.clubs || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      // Mock data
      setClubs([
        {
          _id: '1',
          name: 'Tech Club',
          description: 'Explore technology, coding, and innovation',
          category: 'Technical',
          members: 150,
          logo: '',
        },
        {
          _id: '2',
          name: 'Music Society',
          description: 'For music lovers and performers',
          category: 'Cultural',
          members: 85,
          logo: '',
        },
        {
          _id: '3',
          name: 'Sports Club',
          description: 'Stay fit and competitive',
          category: 'Sports',
          members: 200,
          logo: '',
        },
        {
          _id: '4',
          name: 'Photography Club',
          description: 'Capture moments and tell stories',
          category: 'Creative',
          members: 60,
          logo: '',
        },
        {
          _id: '5',
          name: 'Drama Club',
          description: 'Express yourself through theater',
          category: 'Cultural',
          members: 45,
          logo: '',
        },
        {
          _id: '6',
          name: 'Robotics Club',
          description: 'Build and program robots',
          category: 'Technical',
          members: 75,
          logo: '',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = (clubId) => {
    if (!registeredClubIds.includes(clubId)) {
      setRegisteredClubIds([...registeredClubIds, clubId]);
      alert('Successfully joined the club!');
    }
  };

  // Filter clubs based on active tab and search
  const filteredClubs = clubs
    .filter(club => {
      // Admin sees all clubs, no tab filtering
      if (isAdmin) return true;
      
      // Filter by tab for students
      if (activeTab === 'registered') {
        return registeredClubIds.includes(club._id);
      }
      return true;
    })
    .filter(club => {
      // Filter by search term
      return club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getCategoryColor = (category) => {
    const colors = {
      Technical: 'from-blue-500 to-blue-600',
      Cultural: 'from-purple-500 to-purple-600',
      Sports: 'from-green-500 to-green-600',
      Creative: 'from-pink-500 to-pink-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const isRegistered = (clubId) => registeredClubIds.includes(clubId);

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
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? 'Club Management' : 'Clubs'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin 
              ? 'View and manage all campus clubs' 
              : 'Join clubs and connect with like-minded students'}
          </p>
        </div>

        {/* Tabs - Hide for Admin */}
        {!isAdmin && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Campus Clubs
              </button>
              <button
                onClick={() => setActiveTab('registered')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'registered'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Registered Clubs
                {registeredClubIds.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                    {registeredClubIds.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div key={club._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Club Header */}
              <div className={`h-32 bg-gradient-to-br ${getCategoryColor(club.category)} flex items-center justify-center`}>
                {club.logo ? (
                  <img src={club.logo} alt={club.name} className="w-20 h-20 rounded-full bg-white" />
                ) : (
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <Users size={40} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Club Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{club.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-1" />
                    <span>{club.members} members</span>
                  </div>
                  <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(club.category)} text-white text-xs font-semibold rounded-full`}>
                    {club.category}
                  </span>
                </div>

                {/* Admin View - Show View Details button */}
                {isAdmin ? (
                  <Link
                    to={`/clubs/${club._id}`}
                    className="block w-full text-center px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
                  >
                    <Users size={18} className="inline mr-2" />
                    View Details
                  </Link>
                ) : (
                  /* Student View - Show Join/Access based on registration */
                  isRegistered(club._id) ? (
                    <Link
                      to={`/clubs/${club._id}`}
                      className="block w-full text-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                    >
                      <CheckCircle size={18} className="inline mr-2" />
                      Access Club
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleJoinClub(club._id)}
                      className="w-full text-center px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors font-medium"
                    >
                      <UserPlus size={18} className="inline mr-2" />
                      Join Club
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
