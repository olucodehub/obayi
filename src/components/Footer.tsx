import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cyan-700 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-cyan-300" />
              <span className="ml-2 text-2xl font-bold">Obayi</span>
            </div>
            <p className="text-cyan-100 mb-4">
              Empowering children in Africa through education and sustainable support. 
              Registered UK charity committed to breaking the cycle of poverty.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/Obayi4Education?t=Grbu7vicrEWhaj793uCWrw&s=09" className="text-cyan-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/obayi4education/profilecard/?igsh=MWxmYmJmeGE0N2w3MA%3D%3D" className="text-cyan-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cyan-200 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-cyan-200 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/programs" className="text-cyan-200 hover:text-white transition-colors">Programs</Link>
              </li>
              <li>
                <Link to="/adopt" className="text-cyan-200 hover:text-white transition-colors">Adopt a Child</Link>
              </li>
              <li>
                <Link to="/ledger" className="text-cyan-200 hover:text-white transition-colors">Public Ledger</Link>
              </li>
              <li>
                <Link to="/login" className="text-cyan-200 hover:text-white transition-colors">Log In</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyan-300 mr-2 mt-0.5" />
                <span className="text-cyan-100">United Kingdom</span>
              </li>
              {/* <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-300 mr-2" />
                <span className="text-cyan-100">+44 123 456 7890</span>
              </li> */}
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-300 mr-2" />
                <span className="text-cyan-100">info@obayi.co</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-cyan-100 mb-4">
              Subscribe to our newsletter to receive updates on our work and how you can help.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-cyan-600 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-cyan-600 mt-12 pt-8 text-center">
          <p className="text-cyan-200">
            &copy; {new Date().getFullYear()} Obayi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;