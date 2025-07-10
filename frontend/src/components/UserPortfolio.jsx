import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const UserPortfolio = ({ userId }) => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEndorseModal, setShowEndorseModal] = useState(false);
  const [endorsement, setEndorsement] = useState({ skill: '', message: '' });

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/portfolio`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndorse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${userId}/endorse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(endorsement)
      });
      
      if (response.ok) {
        setShowEndorseModal(false);
        setEndorsement({ skill: '', message: '' });
        fetchPortfolio(); // Refresh portfolio
      }
    } catch (error) {
      console.error('Error adding endorsement:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Portfolio not found</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === userId;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{portfolio.user.username}</h1>
            <p className="text-gray-600 mt-1">{portfolio.user.bio}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>{portfolio.user.school}</span>
              <span>•</span>
              <span>{portfolio.user.major}</span>
              <span>•</span>
              <span>Member since {new Date(portfolio.user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          {!isOwnProfile && (
            <button
              onClick={() => setShowEndorseModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Endorse Skills
            </button>
          )}
        </div>
        
        <div className="flex gap-8 mt-6 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{portfolio.user.followers}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{portfolio.user.following}</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{portfolio.reviews?.length || 0}</div>
            <div className="text-sm text-gray-500">Solutions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          <ul className="space-y-2">
            {portfolio.achievements?.map((achievement, index) => (
              <li key={index} className="flex items-center">
                <span className="text-yellow-500 mr-2">🏆</span>
                <span className="text-gray-700">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="grid gap-4">
            {portfolio.projects?.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tech?.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm mt-2 inline-block"
                  >
                    View on GitHub →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Endorsements Section */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Endorsements</h2>
          <div className="space-y-4">
            {portfolio.endorsements?.map((endorsement) => (
              <div key={endorsement.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {endorsement.fromUsername}
                    </div>
                    <div className="text-sm text-gray-500">
                      Endorsed for <span className="font-medium text-blue-600">{endorsement.skill}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(endorsement.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{endorsement.message}</p>
              </div>
            ))}
            {(!portfolio.endorsements || portfolio.endorsements.length === 0) && (
              <p className="text-gray-500 text-center py-4">No endorsements yet</p>
            )}
          </div>
        </div>

        {/* Solutions Section */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Recent Solutions</h2>
          <div className="space-y-4">
            {portfolio.reviews?.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{review.problemTitle}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {review.language}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                        {review.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">❤️ {review.likes}</span>
                      <span className="text-sm text-gray-500">💬 {review.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {(!portfolio.reviews || portfolio.reviews.length === 0) && (
              <p className="text-gray-500 text-center py-4">No solutions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Endorsement Modal */}
      {showEndorseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Endorse Skills</h3>
            <form onSubmit={handleEndorse}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <input
                  type="text"
                  value={endorsement.skill}
                  onChange={(e) => setEndorsement({ ...endorsement, skill: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Algorithms, Python"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={endorsement.message}
                  onChange={(e) => setEndorsement({ ...endorsement, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Share why you're endorsing this skill..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEndorseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Endorse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPortfolio; 