import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = ({ onViewReview, onCreateReview }) => {
  const { user, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [token]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = () => {
    onCreateReview();
  };

  const handleViewReview = (review) => {
    onViewReview('code-review', review);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchReviews}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">
          Review and improve your code with AI-powered feedback
        </p>
      </div>

      {/* Create Review Button */}
      <div className="mb-8">
        <button
          onClick={handleCreateReview}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create New Code Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleViewReview(review)}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {review.language}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {review.problemTitle}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {review.problemDescription}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  by {review.username}
                </span>
                <span className="text-sm text-gray-500">
                  {review.comments?.length || 0} comments
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-900">
                  Score: {review.analysis?.quality_score || 'N/A'}/10
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first code review
          </p>
          <button
            onClick={handleCreateReview}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Review
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 