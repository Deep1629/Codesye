import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = ({ onLogin }) => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async (userType) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      login(data.token, data.user);
      onLogin(data.user);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    {
      type: 'alex',
      name: 'Alex Chen',
      role: 'Stanford CS Student',
      description: 'Focusing on algorithms and data structures',
      avatar: '👨‍💻'
    },
    {
      type: 'sarah',
      name: 'Sarah Johnson',
      role: 'MIT CS Student',
      description: 'Interested in web development and React',
      avatar: '👩‍💻'
    },
    {
      type: 'mike',
      name: 'Mike Rodriguez',
      role: 'Berkeley CS Student',
      description: 'Machine learning and Python enthusiast',
      avatar: '👨‍🔬'
    },
    {
      type: 'emma',
      name: 'Emma Wilson',
      role: 'CMU CS Student',
      description: 'Systems programming and C++',
      avatar: '👩‍🔧'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            StudentCode
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Grammarly for Code
          </p>
          <p className="text-gray-500">
            Get real-time feedback, suggestions, and learning insights as you code
          </p>
        </div>

        {/* Demo Login Cards */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Choose a Demo User
          </h2>
          
          <div className="space-y-3">
            {demoUsers.map((user) => (
              <button
                key={user.type}
                onClick={() => handleDemoLogin(user.type)}
                disabled={loading}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.role}</div>
                    <div className="text-xs text-gray-500">{user.description}</div>
                  </div>
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Demo users have sample data and full access to all features
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-medium text-gray-900">Real-time Analysis</h3>
            <p className="text-xs text-gray-600">Get instant feedback as you code</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-medium text-gray-900">Smart Suggestions</h3>
            <p className="text-xs text-gray-600">AI-powered code improvements</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl mb-2">🎓</div>
            <h3 className="font-medium text-gray-900">Learning Insights</h3>
            <p className="text-xs text-gray-600">Educational tips and explanations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 