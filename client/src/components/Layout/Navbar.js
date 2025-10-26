import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Calendar, Search, MessageCircle, Users, 
  MessageSquare, Bell, LogOut, Menu, X, User, Shield 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role-based navigation items
  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Home' },
      { path: '/events', icon: Calendar, label: 'Events' },
      { path: '/announcements', icon: Bell, label: 'Announcements' },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/lost-found', icon: Search, label: 'Lost & Found' },
        { path: '/clubs', icon: Users, label: 'Clubs' },
        { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
        { path: '/admin', icon: Shield, label: 'Admin Panel' },
      ];
    }

    if (user?.role === 'faculty') {
      return [
        ...baseItems,
        { path: '/lost-found', icon: Search, label: 'Lost & Found' },
        { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
      ];
    }

    // Student
    return [
      ...baseItems,
      { path: '/lost-found', icon: Search, label: 'Lost & Found' },
      { path: '/clubs', icon: Users, label: 'Clubs' },
      { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img 
                src="/images/klh-logo.png" 
                alt="KLH University" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold text-gray-900">KLHConnect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/messages"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative"
            >
              <MessageCircle size={24} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-full"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
