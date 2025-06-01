import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const Navbar = () => {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold'
      : 'text-gray-700 hover:text-blue-600 transition-colors';

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">📝</div>
            <span className="text-xl font-bold text-gray-900">BlogSpace</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink
                  to="/blogs/create-blog"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold'
                      : 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                  }
                >
                  Write Blog
                </NavLink>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">
                    Hi, {userData?.fullName?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive
                      ? 'bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold'
                      : 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={navLinkClass}
                end
              >
                Home
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={navLinkClass}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/blogs/create-blog"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 transition-colors'
                    }
                  >
                    Write Blog
                  </NavLink>
                  <span className="text-gray-600">
                    Hi, {userData?.fullName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-800 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={navLinkClass}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 transition-colors'
                    }
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
