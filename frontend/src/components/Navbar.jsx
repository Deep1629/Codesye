import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Code, LogOut, User, Users } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">StudentCode</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/feed" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Solutions
                </Link>
                <Link 
                  to={`/portfolio/${user.id}`} 
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Portfolio</span>
                </Link>
                <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 