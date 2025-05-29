import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsProgramsOpen(false);
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

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <div className="flex items-center">
              <span className="ml-2 text-2xl font-bold text-cyan-700">
                <img
                  src="/images/logotransparent.png"
                  alt="Obayi Logo"
                  className="h-16 w-auto object-contain"
                />
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${isActive('/') && 'text-cyan-500'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${isActive('/about') && 'text-cyan-500'}`}
            >
              About Us
            </Link>
            
            {/* Programs Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleProgramsMouseEnter}
              onMouseLeave={handleProgramsMouseLeave}
            >
              <button
                className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded flex items-center ${
                  isProgramsActive() && 'text-cyan-500'
                }`}
              >
                Programs
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {isProgramsOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2"
                >
                  <Link
                    to="/programs/scholarships"
                    className="block px-4 py-2 text-cyan-700 hover:bg-cyan-600 hover:text-white"
                    onClick={closeMenu}
                  >
                    Scholarships
                  </Link>
                  <Link
                    to="/programs/support"
                    className="block px-4 py-2 text-cyan-700 hover:bg-cyan-600 hover:text-white"
                    onClick={closeMenu}
                  >
                    Support Programs
                  </Link>
                  <Link
                    to="/programs/structure"
                    className="block px-4 py-2 text-cyan-700 hover:bg-cyan-600 hover:text-white"
                    onClick={closeMenu}
                  >
                    Structure
                  </Link>
                </div>
              )}
            </div>
            <Link 
              to="/testimonials" 
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${isActive('/testimonials') && 'text-cyan-500'}`}
            >
              Testimonials
            </Link>
            <Link 
              to="/faq" 
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${isActive('/faq') && 'text-cyan-500'}`}
              onClick={closeMenu}
            >
              FAQ
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium text-cyan-500 transition-colors hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${isActive('/contact') && 'text-cyan-500'}`}
            >
              Contact
            </Link>
            <Link 
              to="/donate" 
              className="px-4 py-2 rounded-md bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-colors"
            >
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-cyan-700 hover:text-cyan-500 focus:outline-none" 
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-md shadow-lg mt-2">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${isActive('/') && 'text-cyan-500'}`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${isActive('/about') && 'text-cyan-500'}`}
                onClick={closeMenu}
              >
                About Us
              </Link>
              
              {/* Mobile Programs Menu */}
              <div className="px-3 py-2">
                <button
                  className={`flex items-center w-full text-left font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 py-2 rounded ${
                    isProgramsActive() && 'text-cyan-500'
                  }`}
                  onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                >
                  Programs
                  <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProgramsOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      to="/programs/scholarships"
                      className="block py-2 text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 rounded"
                      onClick={closeMenu}
                    >
                      Scholarships
                    </Link>
                    <Link
                      to="/programs/support"
                      className="block py-2 text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 rounded"
                      onClick={closeMenu}
                    >
                      Support Programs
                    </Link>
                    <Link
                      to="/programs/structure"
                      className="block py-2 text-cyan-500 hover:bg-cyan-600 hover:text-white px-3 rounded"
                      onClick={closeMenu}
                    >
                      Infrastructure
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                to="/testimonials" 
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${isActive('/testimonials') && 'text-cyan-500'}`}
                onClick={closeMenu}
              >
                Testimonials
              </Link>
              <Link 
                to="/faq" 
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${isActive('/faq') && 'text-cyan-500'}`}
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                className={`block px-3 py-2 rounded-md font-medium text-cyan-500 hover:bg-cyan-600 hover:text-white ${isActive('/contact') && 'text-cyan-500'}`}
                onClick={closeMenu}
              >
                Contact
              </Link>
              <Link 
                to="/donate" 
                className="block px-3 py-2 rounded-md text-white bg-cyan-500 font-medium hover:bg-cyan-600"
                onClick={closeMenu}
              >
                Donate
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;



