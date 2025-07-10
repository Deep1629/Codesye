import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CodeEditor from './CodeEditor';

const EnhancedCodeReview = ({ reviewId }) => {
  const { user } = useAuth();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [showPeerReviewModal, setShowPeerReviewModal] = useState(false);
  const [peerReview, setPeerReview] = useState({ content: '', rating: 5 });
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReview(data);
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Request failed';
      const status = error.response?.status;
      window.alert(`Error${status ? ' (' + status + ')' : ''}: ${errMsg}`);
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReview(prev => ({
          ...prev,
          isLiked: data.isLiked,
          likes: data.likes
        }));
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Request failed';
      const status = error.response?.status;
      window.alert(`Error${status ? ' (' + status + ')' : ''}: ${errMsg}`);
      console.error('API Error:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (response.ok) {
        const comment = await response.json();
        setReview(prev => ({
          ...prev,
          comments: [...prev.comments, comment]
        }));
        setNewComment('');
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Request failed';
      const status = error.response?.status;
      window.alert(`Error${status ? ' (' + status + ')' : ''}: ${errMsg}`);
      console.error('API Error:', error);
    }
  };

  const handlePeerReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reviews/${reviewId}/peer-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(peerReview)
      });
      
      if (response.ok) {
        const newPeerReview = await response.json();
        setReview(prev => ({
          ...prev,
          comments: [...prev.comments, newPeerReview]
        }));
        setShowPeerReviewModal(false);
        setPeerReview({ content: '', rating: 5 });
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Request failed';
      const status = error.response?.status;
      window.alert(`Error${status ? ' (' + status + ')' : ''}: ${errMsg}`);
      console.error('API Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Review not found</p>
      </div>
    );
  }

  const isOwnReview = user?.id === review.userId;
  const analysis = review.analysis;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{review.problemTitle}</h1>
            <p className="text-gray-600 mt-1">{review.problemDescription}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {review.language}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {review.category}
              </span>
              <span className="text-sm text-gray-500">
                by {review.username}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                review.isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>❤️</span>
              <span>{review.likes}</span>
            </button>
            {!isOwnReview && (
              <button
                onClick={() => setShowPeerReviewModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Peer Review
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Code</h2>
          <CodeEditor
            code={review.code}
            language={review.language}
            readOnly={true}
          />
        </div>

        {/* Analysis Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'analysis' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI Analysis
            </button>
            <button
              onClick={() => setActiveTab('peer-reviews')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'peer-reviews' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Peer Reviews
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'comments' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Comments
            </button>
          </div>

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Quality Score */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.quality_score}/10
                </div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>

              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div>
                  <h3 className="font-semibold text-green-700 mb-2">✅ Strengths</h3>
                  <ul className="space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-gray-700">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Issues */}
              {analysis.issues && analysis.issues.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-700 mb-2">⚠️ Issues Found</h3>
                  <div className="space-y-3">
                    {analysis.issues.map((issue, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            issue.severity === 'high' ? 'bg-red-100 text-red-800' :
                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {issue.severity}
                          </span>
                          <span className="text-sm font-medium">{issue.type}</span>
                          {issue.line && (
                            <span className="text-xs text-gray-500">Line {issue.line}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{issue.description}</p>
                        <p className="text-sm text-blue-600 font-medium">💡 {issue.suggestion}</p>
                        <p className="text-xs text-gray-500 mt-1">📚 {issue.learning_point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-700 mb-2">💡 Recommendations</h3>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              {analysis.next_steps && analysis.next_steps.length > 0 && (
                <div>
                  <h3 className="font-semibold text-purple-700 mb-2">🚀 Next Steps</h3>
                  <ul className="space-y-1">
                    {analysis.next_steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-700">• {step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Tips */}
              {analysis.learning_tips && analysis.learning_tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-indigo-700 mb-2">🎓 Learning Tips</h3>
                  <ul className="space-y-1">
                    {analysis.learning_tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-700">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Examples */}
              {analysis.code_examples && analysis.code_examples.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">📝 Code Examples</h3>
                  <div className="space-y-2">
                    {analysis.code_examples.map((example, index) => (
                      <pre key={index} className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {example}
                      </pre>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Assessment */}
              {analysis.overall_assessment && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">📋 Overall Assessment</h3>
                  <p className="text-sm text-gray-700">{analysis.overall_assessment}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'peer-reviews' && (
            <div className="space-y-4">
              {review.comments
                .filter(comment => comment.isPeerReview)
                .map((peerReview) => (
                  <div key={peerReview.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">
                        {peerReview.username}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              {i < peerReview.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(peerReview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{peerReview.content}</p>
                  </div>
                ))}
              {review.comments.filter(comment => comment.isPeerReview).length === 0 && (
                <p className="text-gray-500 text-center py-4">No peer reviews yet</p>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {review.comments
                .filter(comment => !comment.isPeerReview)
                .map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">
                        {comment.username}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              
              {/* Add Comment Form */}
              <form onSubmit={handleComment} className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Peer Review Modal */}
      {showPeerReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Peer Review</h3>
            <form onSubmit={handlePeerReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPeerReview({ ...peerReview, rating: star })}
                      className={`text-2xl ${
                        star <= peerReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  value={peerReview.content}
                  onChange={(e) => setPeerReview({ ...peerReview, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Share your thoughts on this solution..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPeerReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCodeReview; 