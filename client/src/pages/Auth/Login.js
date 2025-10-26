import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Instagram Style Mockup */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-96 h-[600px] bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-1 shadow-2xl">
              <div className="w-full h-full bg-black rounded-3xl overflow-hidden">
                {/* Mock Campus Images */}
                <div className="grid grid-cols-2 gap-2 p-4 h-full">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-4xl">📚</span>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-4xl">🎓</span>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-4xl">🏫</span>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-4xl">✨</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-pink-500 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <img 
                  src="/images/klh-logo.png" 
                  alt="KLH University" 
                  className="h-24 w-auto object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">KLHConnect</h1>
              <p className="text-gray-400">Smart Campus Ecosystem</p>
            </div>

            {/* Login Card */}
            <div className="bg-dark-light border border-gray-800 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    placeholder="Phone number, username, or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm mb-4">OR</p>
                <button className="text-primary hover:text-secondary font-semibold text-sm flex items-center justify-center w-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Log in with Facebook
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 bg-dark-light border border-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-secondary font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
