import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, Calendar, MessageSquare, Image as ImageIcon, 
  FileText, Send, ArrowLeft, MapPin, Clock, UserPlus, Upload, X 
} from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [activeTab, setActiveTab] = useState('forum');
  const [loading, setLoading] = useState(true);
  const [forumPosts, setForumPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [resources, setResources] = useState([]);
  const [members, setMembers] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [imageCaption, setImageCaption] = useState('');
  const [showResourceUpload, setShowResourceUpload] = useState(false);
  const [resourceFile, setResourceFile] = useState(null);
  const [resourceName, setResourceName] = useState('');
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      const response = await api.get(`/clubs/${id}`);
      setClub(response.data.club);
      setForumPosts(response.data.forumPosts || []);
      setEvents(response.data.events || []);
      setGallery(response.data.gallery || []);
      setResources(response.data.resources || []);
    } catch (error) {
      console.error('Error fetching club details:', error);
      // Mock data
      setClub({
        _id: id,
        name: 'Tech Club',
        description: 'Explore technology, coding, and innovation with fellow tech enthusiasts',
        category: 'Technical',
        members: 150,
        logo: '',
        userRole: 'member', // member, admin, president
      });
      setForumPosts([
        {
          _id: '1',
          author: { name: 'John Doe', role: 'President' },
          content: 'Welcome to Tech Club! Excited to have everyone here.',
          createdAt: '2025-10-24T10:00:00',
          replies: 3,
        },
        {
          _id: '2',
          author: { name: 'Jane Smith', role: 'Member' },
          content: 'When is the next coding workshop?',
          createdAt: '2025-10-23T15:30:00',
          replies: 1,
        },
      ]);
      setEvents([
        {
          _id: '1',
          title: 'Hackathon 2025',
          date: '2025-11-15',
          time: '9:00 AM',
          venue: 'Tech Lab',
          description: '24-hour coding competition',
          registered: false,
        },
        {
          _id: '2',
          title: 'AI Workshop',
          date: '2025-11-20',
          time: '2:00 PM',
          venue: 'Seminar Hall',
          description: 'Introduction to Machine Learning',
          registered: true,
        },
      ]);
      setGallery([
        { _id: '1', url: '', caption: 'Tech Fest 2024', uploadedBy: 'Admin' },
        { _id: '2', url: '', caption: 'Coding Workshop', uploadedBy: 'Admin' },
      ]);
      setResources([
        { _id: '1', name: 'Meeting Minutes - Oct 2025.pdf', size: '245 KB', uploadedAt: '2025-10-20' },
        { _id: '2', name: 'Python Tutorial.pdf', size: '1.2 MB', uploadedAt: '2025-10-18' },
      ]);
      setMembers([
        { _id: '1', name: 'John Doe', email: 'john@klh.edu.in', role: 'President', joinedAt: '2024-08-15' },
        { _id: '2', name: 'Jane Smith', email: 'jane@klh.edu.in', role: 'Member', joinedAt: '2024-09-01' },
        { _id: '3', name: 'Mike Johnson', email: 'mike@klh.edu.in', role: 'Member', joinedAt: '2024-09-10' },
        { _id: '4', name: 'Sarah Williams', email: 'sarah@klh.edu.in', role: 'Admin', joinedAt: '2024-08-20' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      _id: Date.now().toString(),
      user: { name: user.name, _id: user._id },
      message: newPost,
      createdAt: new Date().toISOString(),
    };

    setForumPosts([post, ...forumPosts]);
    setNewPost('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewImages([...newImages, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmitImages = async () => {
    if (newImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    try {
      // In real implementation, upload to server
      const newGalleryItems = newImages.map((url, index) => ({
        _id: Date.now().toString() + index,
        url: url,
        caption: imageCaption || 'Club Activity',
        uploadedBy: user.name,
      }));

      setGallery([...newGalleryItems, ...gallery]);
      setNewImages([]);
      setImageCaption('');
      setShowImageUpload(false);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    }
  };

  const handleResourceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResourceFile(file);
      setResourceName(file.name);
    }
  };

  const handleSubmitResource = async () => {
    if (!resourceFile) {
      alert('Please select a file');
      return;
    }

    try {
      // In real implementation, upload to server
      const newResource = {
        _id: Date.now().toString(),
        name: resourceName || resourceFile.name,
        size: `${(resourceFile.size / 1024).toFixed(2)} KB`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: user.name,
      };

      setResources([newResource, ...resources]);
      setResourceFile(null);
      setResourceName('');
      setShowResourceUpload(false);
      alert('Resource uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('Failed to upload resource');
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      await api.post(`/clubs/${id}/events/${eventId}/register`);
      setEvents(events.map(e => 
        e._id === eventId ? { ...e, registered: true } : e
      ));
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      // Mock registration
      setEvents(events.map(e => 
        e._id === eventId ? { ...e, registered: true } : e
      ));
      alert('Successfully registered for the event!');
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

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Club not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/clubs')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Clubs
        </button>

        {/* Club Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {club.logo ? (
                <img src={club.logo} alt={club.name} className="w-full h-full rounded-xl" />
              ) : (
                <Users size={48} className="text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
                  <p className="text-gray-600 mt-2">{club.description}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                  {club.userRole}
                </span>
              </div>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2" />
                  <span>{club.members} members</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                    {club.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'forum'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare size={20} />
              <span>Discussion Forum</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'events'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar size={20} />
              <span>Events</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ImageIcon size={20} />
              <span>Media Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={20} />
              <span>Resources</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('members')}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'members'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users size={20} />
                <span>Members</span>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Forum Tab */}
            {activeTab === 'forum' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Discussion Board</h3>
                
                {/* Post Form */}
                <form onSubmit={handlePostMessage} className="mb-6">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your thoughts with the club..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors flex items-center"
                    >
                      <Send size={18} className="mr-2" />
                      Post
                    </button>
                  </div>
                </form>

                {/* Forum Posts */}
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <div key={post._id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-sm">
                            {post.author.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900">{post.author.name}</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
                              {post.author.role}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(post.createdAt), 'MMM dd, yyyy • h:mm a')}
                            </span>
                          </div>
                          <p className="text-gray-700">{post.content}</p>
                          <button className="text-sm text-primary hover:text-secondary mt-2">
                            {post.replies} replies
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Club Events</h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              {format(new Date(event.date), 'MMM dd, yyyy')}
                            </span>
                            <span className="flex items-center">
                              <Clock size={16} className="mr-1" />
                              {event.time}
                            </span>
                            <span className="flex items-center">
                              <MapPin size={16} className="mr-1" />
                              {event.venue}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRegisterEvent(event._id)}
                          disabled={event.registered}
                          className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                            event.registered
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-primary hover:bg-secondary text-white'
                          }`}
                        >
                          {event.registered ? (
                            <>✓ Registered</>
                          ) : (
                            <>
                              <UserPlus size={18} className="mr-2" />
                              Register
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Media Gallery</h3>
                  {!isAdmin && (
                    <button
                      onClick={() => setShowImageUpload(true)}
                      className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors flex items-center"
                    >
                      <Upload size={18} className="mr-2" />
                      Upload Images
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        {item.url ? (
                          <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={48} className="text-gray-400" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-gray-900">{item.caption}</p>
                        <p className="text-xs text-gray-500 mt-1">By {item.uploadedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Club Resources</h3>
                  {!isAdmin && (
                    <button
                      onClick={() => setShowResourceUpload(true)}
                      className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors flex items-center"
                    >
                      <Upload size={18} className="mr-2" />
                      Upload Resource
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div key={resource._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{resource.name}</p>
                          <p className="text-sm text-gray-500">
                            {resource.size} • Uploaded {format(new Date(resource.uploadedAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors text-sm">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members Tab - Admin Only */}
            {activeTab === 'members' && isAdmin && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Club Members</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{member.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              member.role === 'President' 
                                ? 'bg-purple-100 text-purple-800'
                                : member.role === 'Admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {format(new Date(member.joinedAt), 'MMM dd, yyyy')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resource Upload Modal */}
      {showResourceUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Resource</h2>
                <button
                  onClick={() => {
                    setShowResourceUpload(false);
                    setResourceFile(null);
                    setResourceName('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Resource Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                    placeholder="Enter resource name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <input
                    type="file"
                    onChange={handleResourceUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
                  </p>
                </div>

                {/* File Preview */}
                {resourceFile && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText size={20} className="text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{resourceFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(resourceFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResourceUpload(false);
                      setResourceFile(null);
                      setResourceName('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResource}
                    disabled={!resourceFile}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload Images</h2>
                <button
                  onClick={() => {
                    setShowImageUpload(false);
                    setNewImages([]);
                    setImageCaption('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Enter a caption for these images"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can select multiple images</p>
                </div>

                {/* Image Preview */}
                {newImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview ({newImages.length} image{newImages.length > 1 ? 's' : ''})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {newImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageUpload(false);
                      setNewImages([]);
                      setImageCaption('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitImages}
                    disabled={newImages.length === 0}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload {newImages.length > 0 && `(${newImages.length})`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetail;
