import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { user, logout, isAuthenticated, isLoggingOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.auth-menu') && !target.closest('.user-menu')) {
        setIsAuthMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsProgramsOpen(false);
    setIsUserMenuOpen(false);
    setIsAuthMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isProgramsActive = () => {
    return location.pathname.startsWith('/programs');
  };

  const handleProgramsMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setIsProgramsOpen(true);
  };

  const handleProgramsMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsProgramsOpen(false);
    }, 300);
    setCloseTimeout(timeout);
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <nav className='flex items-center justify-between'>
          <Link to='/' className='flex items-center' onClick={closeMenu}>
            <div className='flex items-center'>
              <span className='ml-2 text-2xl font-bold text-cyan-700'>
                <img
                  src='/images/logotransparent.png'
                  alt='Obayi Logo'
                  className='h-16 w-auto object-contain'
                />
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-8'>
            <Link
              to='/'
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                isActive('/') && 'text-cyan-500'
              }`}
            >
              Home
            </Link>
            <Link
              to='/about'
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                isActive('/about') && 'text-cyan-500'
              }`}
            >
              About Us
            </Link>

            {/* Programs Dropdown */}
            <div
              className='relative'
              onMouseEnter={handleProgramsMouseEnter}
              onMouseLeave={handleProgramsMouseLeave}
            >
              <button
                className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded flex items-center ${
                  isProgramsActive() && 'text-cyan-500'
                }`}
              >
                Programs
                <ChevronDown className='h-4 w-4 ml-1' />
              </button>

              {isProgramsOpen && (
                <div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2'>
                  <Link
                    to='/programs/scholarships'
                    className='block px-4 py-2 text-cyan-700 hover:bg-cyan-600 hover:text-white'
                    onClick={closeMenu}
                  >
                    Scholarships
                  </Link>
                  <Link
                    to='/programs/support'
                    className='block px-4 py-2 text-cyan-700 hover:bg-cyan-600 hover:text-white'
                    onClick={closeMenu}
                  >
                    Support Programs
                  </Link>
                  <Link
                    to='/programs/structure'
                    className='block px-4 py-2 text-cyan-700 hover:bg-cyan-600 hover:text-white'
                    onClick={closeMenu}
                  >
                    Structure
                  </Link>
                </div>
              )}
            </div>
            <Link
              to='/testimonials'
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                isActive('/testimonials') && 'text-cyan-500'
              }`}
            >
              Testimonials
            </Link>
            <Link
              to='/faq'
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                isActive('/faq') && 'text-cyan-500'
              }`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <Link
              to='/contact'
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                isActive('/contact') && 'text-cyan-500'
              }`}
            >
              Contact
            </Link>
            <Link
              to='/press'
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                isActive('/press') && 'text-cyan-500'
              }`}
            >
              Press
            </Link>
            <Link
              to='/donate'
              className='px-4 py-2 rounded-md bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors'
            >
              Donate
            </Link>

            {/* Authentication Links */}
            {isAuthenticated ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center px-3 py-2 rounded-md text-cyan-600 hover:bg-cyan-50 transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  {user?.firstName}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                      onClick={closeMenu}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin mr-2"></div>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative auth-menu">
                <button
                  onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                  className="flex items-center px-4 py-2 rounded-md bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
                >
                  Get Started
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isAuthMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border">
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                      onClick={closeMenu}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600"
                      onClick={closeMenu}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Join Us
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className='md:hidden p-2 rounded-md text-cyan-700 hover:text-cyan-500 focus:outline-none'
            onClick={toggleMenu}
          >
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-md shadow-lg mt-2'>
              <Link
                to='/'
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${
                  isActive('/') && 'text-cyan-500'
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to='/about'
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${
                  isActive('/about') && 'text-cyan-500'
                }`}
                onClick={closeMenu}
              >
                About Us
              </Link>

              {/* Mobile Programs Menu */}
              <div className='px-3 py-2'>
                <button
                  className={`flex items-center w-full text-left font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                    isProgramsActive() && 'text-cyan-500'
                  }`}
                  onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                >
                  Programs
                  <ChevronDown
                    className={`h-4 w-4 ml-1 transform transition-transform ${
                      isProgramsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isProgramsOpen && (
                  <div className='pl-4 mt-2 space-y-2'>
                    <Link
                      to='/programs/scholarships'
                      className='block py-2 text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 rounded'
                      onClick={closeMenu}
                    >
                      Scholarships
                    </Link>
                    <Link
                      to='/programs/support'
                      className='block py-2 text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 rounded'
                      onClick={closeMenu}
                    >
                      Support Programs
                    </Link>
                    <Link
                      to='/programs/structure'
                      className='block py-2 text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 rounded'
                      onClick={closeMenu}
                    >
                      Infrastructure
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to='/testimonials'
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${
                  isActive('/testimonials') && 'text-cyan-500'
                }`}
                onClick={closeMenu}
              >
                Testimonials
              </Link>
              <Link
                to='/faq'
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${
                  isActive('/faq') && 'text-cyan-500'
                }`}
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link
                to='/press'
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${
                  isActive('/press') && 'text-cyan-500'
                }`}
                onClick={closeMenu}
              >
                Press
              </Link>
              <Link
                to='/contact'
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${
                  isActive('/contact') && 'text-cyan-500'
                }`}
                onClick={closeMenu}
              >
                Contact
              </Link>
              <Link
                to='/donate'
                className='block px-3 py-2 rounded-md text-white bg-cyan-500 font-medium hover:bg-cyan-600'
                onClick={closeMenu}
              >
                Donate
              </Link>

              {/* Mobile Authentication Links */}
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center px-3 py-2 text-cyan-600">
                      <User className="w-5 h-5 mr-2" />
                      <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full text-left px-3 py-2 rounded-md font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin mr-2"></div>
                          Logging out...
                        </>
                      ) : (
                        'Logout'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-3 py-2 auth-menu">
                    <button
                      className="flex items-center w-full px-3 py-2 rounded-md text-white bg-cyan-500 font-medium hover:bg-cyan-600 justify-center"
                      onClick={() => setIsAuthMenuOpen(!isAuthMenuOpen)}
                    >
                      Get Started
                      <ChevronDown className={`w-4 h-4 ml-1 transform transition-transform ${
                        isAuthMenuOpen ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {isAuthMenuOpen && (
                      <div className="mt-2 space-y-2 pl-2">
                        <Link
                          to="/login"
                          className="flex items-center px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white"
                          onClick={closeMenu}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white"
                          onClick={closeMenu}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Join Us
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
