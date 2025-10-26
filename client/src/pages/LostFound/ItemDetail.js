import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, ArrowLeft, MessageCircle } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchItemDetail();
  }, [id]);

  const fetchItemDetail = async () => {
    try {
      const response = await api.get(`/lost-found/${id}`);
      setItem(response.data.item);
    } catch (error) {
      console.error('Error fetching item:', error);
      // Mock data
      setItem({
        _id: id,
        itemName: 'Black Smartphone',
        description: 'iPhone with black case. Has a small crack on the bottom right corner.',
        location: 'Gym Locker Room',
        category: 'Electronics',
        dateFound: '2025-10-23',
        imageUrl: '',
        status: 'approved',
        reportedBy: {
          _id: '123',
          name: 'John Doe',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFoundIt = async () => {
    if (!user) {
      alert('Please login to claim this item');
      return;
    }
    setShowChat(true);
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

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Item not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/lost-found')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to catalog
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.itemName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.itemName}</h1>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin size={18} className="mr-2 text-gray-400" />
                      <span><strong>Location:</strong> {item.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar size={18} className="mr-2 text-gray-400" />
                      <span><strong>Date Found:</strong> {format(new Date(item.dateFound), 'MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="w-5 h-5 mr-2"></span>
                      <span><strong>Category:</strong> {item.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleFoundIt}
                className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" />
                I Found It!
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Clicking this will open a chat with the person who found your item
              </p>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        {showChat && (
          <div className="mt-8">
            <ChatComponent item={item} user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

// Chat Component
const ChatComponent = ({ item, user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'other',
      text: `Hi! I found your ${item.itemName}. When would be a good time to meet?`,
      time: '10:30 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {item.reportedBy?.name?.charAt(0) || 'J'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{item.reportedBy?.name || 'John Doe'}</h3>
            <p className="text-sm text-gray-500">About: {item.itemName}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'me'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="p-2 bg-black hover:bg-gray-900 text-white rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemDetail;
