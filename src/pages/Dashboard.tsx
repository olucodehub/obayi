import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DonorDashboard from './dashboards/DonorDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();


  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  switch (user.userType) {
    case 'donor':
      return <DonorDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Role</h1>
            <p className="text-gray-600">Your account role is not recognized.</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;