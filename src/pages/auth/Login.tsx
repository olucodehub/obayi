import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import usePageTitle from '../../hooks/usePageTitle';
import { AuthService as LocalAuthService } from '../../utils/auth';

const Login: React.FC = () => {
  usePageTitle('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Login attempt:', { email, password });
    const users = LocalAuthService.getUsers();
    console.log('Available users:', users);
    console.log('Looking for user with email:', email);
    const targetUser = users.find(u => u.email === email);
    console.log('Target user found:', targetUser);
    if (targetUser) {
      console.log('Password match?', targetUser.password === password);
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = () => {
    try {
      console.log('Before creating admin - Current users:', LocalAuthService.getUsers());
      LocalAuthService.forceCreateAdminUser();
      console.log('After creating admin - Current users:', LocalAuthService.getUsers());

      const users = LocalAuthService.getUsers();
      const adminUser = users.find(u => u.email === 'admin@obayi.co');
      console.log('Admin user found:', adminUser);

      alert(`Admin user created! Found ${users.length} total users. Admin user: ${adminUser ? 'EXISTS' : 'NOT FOUND'}`);
    } catch (error) {
      console.error('Error creating admin user:', error);
      alert('Error creating admin user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleShowUsers = () => {
    const users = LocalAuthService.getUsers();
    console.log('All users in localStorage:', users);
    console.log('localStorage keys:', Object.keys(localStorage));
    console.log('Raw obayi_users data:', localStorage.getItem('obayi_users'));
    alert(`Found ${users.length} users in localStorage. Check console for details.`);
  };

  const handleClearStorage = () => {
    if (confirm('This will clear all localStorage data. Are you sure?')) {
      LocalAuthService.clearAllData();
      alert('localStorage cleared! Now try creating admin user.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="/images/logotransparent.png"
            alt="Obayi Logo"
            className="mx-auto h-16 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-cyan-700">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-card" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Debug Helper Buttons - only in development */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCreateAdmin}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors font-medium text-sm"
            >
              Create Admin User (Dev Helper)
            </button>
            <button
              type="button"
              onClick={handleShowUsers}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors font-medium text-sm"
            >
              Show All Users (Debug)
            </button>
            <button
              type="button"
              onClick={handleClearStorage}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors font-medium text-sm"
            >
              Clear LocalStorage (Reset)
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;