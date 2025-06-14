import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, PenTool, User, LogOut, Settings, BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setShowUserMenu(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileMenu(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            aria-label="StartupStories Home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-gray-900">StartupStories</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-8"
            role="search"
          >
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Search case studies"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4" role="navigation">
            {user ? (
              <>
                <Link
                  to="/write"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Write a case study"
                >
                  <PenTool className="w-4 h-4" aria-hidden="true" />
                  <span>Write</span>
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-expanded={showUserMenu}
                    aria-label="User menu"
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                  </button>

                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                        role="menuitem"
                      >
                        <User className="w-4 h-4" aria-hidden="true" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                        role="menuitem"
                      >
                        <Settings className="w-4 h-4" aria-hidden="true" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Create a new account"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={showMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-200 py-4"
            role="menu"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2 mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Search case studies"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="px-2 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/write"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <PenTool className="w-5 h-5" aria-hidden="true" />
                    <span>Write</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Settings className="w-5 h-5" aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}