import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageSquare, Eye, Filter, TrendingUp, Users } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SocialFeed = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [feed, setFeed] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('SocialFeed mounted')
    if (!token) {
      setError('No auth token')
      setLoading(false)
      return
    }
    fetchFeed()
    fetchTrending()
  }, [token, selectedCategory, selectedLanguage, currentPage])

  const fetchFeed = async () => {
    try {
      const response = await axios.get('/api/feed', {
        params: {
          category: selectedCategory,
          language: selectedLanguage,
          page: currentPage,
          limit: 10
        }
      })
      setFeed(response.data.reviews)
      setTotalPages(response.data.totalPages)
      console.log('Feed loaded:', response.data)
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || 'Failed to fetch reviews';
      const status = error.response?.status;
      toast.error(`Feed error${status ? ' (' + status + ')' : ''}: ${errMsg}`);
      setError(errMsg);
      console.error('API Error:', error);
    } finally {
      setLoading(false)
    }
  }

  const fetchTrending = async () => {
    try {
      const response = await axios.get('/api/trending')
      setTrending(response.data)
    } catch (error) {
      console.error('Failed to fetch trending')
    }
  }

  const handleLike = async (reviewId) => {
    try {
      const response = await axios.post(`/api/reviews/${reviewId}/like`)
      setFeed(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, isLiked: response.data.isLiked, likes: response.data.likes }
          : review
      ))
    } catch (error) {
      toast.error('Failed to like review')
    }
  }

  const getQualityColor = (score) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'database', label: 'Database' },
    { value: 'system-design', label: 'System Design' },
    { value: 'general', label: 'General' }
  ]

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' }
  ]

  if (loading) return <div>Loading social feed...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Code Community</h1>
          <p className="text-gray-600 mt-2">Discover how other students solve problems</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Create New Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-3">
          {/* Filters */}
          <div className="card mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="input-field"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Feed */}
          {feed.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No posts found. Be the first to share your solution!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {feed.map((review) => (
                <div key={review.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/review/${review.id}`)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {review.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p 
                          className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/portfolio/${review.userId}`);
                          }}
                        >
                          {review.username}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {review.language}
                      </span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded">
                        {review.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {review.problemTitle}
                  </h3>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <span className={`font-semibold ${getQualityColor(review.analysis.quality_score)}`}>
                        {review.analysis.quality_score}/10
                      </span>
                      <span className="text-gray-600">Quality Score</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {review.analysis.overall_assessment}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(review.id)
                        }}
                        className={`flex items-center space-x-1 ${
                          review.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        } transition-colors`}
                      >
                        <Heart className={`h-5 w-5 ${review.isLiked ? 'fill-current' : ''}`} />
                        <span>{review.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageSquare className="h-5 w-5" />
                        <span>{review.commentCount}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/review/${review.id}`)
                      }}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                      <span>View Solution</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Trending */}
          <div className="card mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Trending Solutions</h3>
            </div>
            <div className="space-y-3">
              {trending.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  onClick={() => navigate(`/review/${review.id}`)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {review.problemTitle}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{review.username}</span>
                    <div className="flex items-center space-x-2">
                      <span>❤️ {review.likes}</span>
                      <span>💬 {review.commentCount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Solutions</span>
                <span className="font-semibold">{feed.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Students</span>
                <span className="font-semibold">{new Set(feed.map(r => r.userId)).size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Languages</span>
                <span className="font-semibold">{new Set(feed.map(r => r.language)).size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialFeed 