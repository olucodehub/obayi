import React, { useState } from 'react';
import Button from './Button';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Reset form
      setEmail('');
      setName('');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-8">
          Join our newsletter to receive updates about our projects, success stories, and ways you can help make a difference.
        </p>
        
        {isSubmitted ? (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-800 font-medium">Thank you for subscribing to our newsletter!</p>
            <p className="text-green-700 mt-2">You'll start receiving updates from Obayi soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button 
              type="submit" 
              fullWidth 
              disabled={isLoading}
              variant="primary"
              size="lg"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              By subscribing, you agree to our privacy policy. We'll never share your information.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;