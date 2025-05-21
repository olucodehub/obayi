import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4 py-16">
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We're sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Button to="/" variant="primary" className="flex items-center justify-center mx-auto">
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            Looking for something specific? Visit our{' '}
            <Link to="/contact" className="text-orange-500 hover:underline">
              contact page
            </Link>{' '}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;