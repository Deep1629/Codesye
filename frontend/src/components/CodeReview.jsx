import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CodeReview = ({ review, onBack }) => {
  const { user, token } = useContext(AuthContext);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${review.id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const comment = await response.json();
      review.comments.push(comment);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getQualityColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {review.problemTitle}
            </h1>
            <p className="text-gray-600">
              by {review.username} • {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(review.analysis?.quality_score)}`}>
            Score: {review.analysis?.quality_score || 'N/A'}/10
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Code</h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-gray-100 text-sm">
              <code>{review.code}</code>
            </pre>
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded">
              {review.language}
            </span>
            <span>{review.problemDescription}</span>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
          
          {review.analysis && (
            <div className="space-y-6">
              {/* Overall Assessment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Assessment</h3>
                <p className="text-gray-700">{review.analysis.overall_assessment}</p>
              </div>

              {/* Issues */}
              {review.analysis.issues && review.analysis.issues.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Issues Found</h3>
                  <div className="space-y-3">
                    {review.analysis.issues.map((issue, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{issue.description}</p>
                            {issue.suggestion && (
                              <p className="text-sm text-red-600 mt-1">Suggestion: {issue.suggestion}</p>
                            )}
                          </div>
                          {issue.line && (
                            <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                              Line {issue.line}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {review.analysis.recommendations && review.analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {review.analysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Tips */}
              {review.analysis.learning_tips && review.analysis.learning_tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Learning Tips</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {review.analysis.learning_tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Comments ({review.comments?.length || 0})</h2>
        
        {/* Add Comment */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {review.comments && review.comments.length > 0 ? (
            review.comments.map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{comment.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeReview; 