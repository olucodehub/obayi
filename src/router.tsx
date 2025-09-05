import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Donate from './pages/Donate';
import AdoptChild from './pages/AdoptChild';
import Ledger from './pages/Ledger';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Scholarships from './pages/programs/Scholarships';
import Support from './pages/programs/Support';
import Structure from './pages/programs/Structure';
import FAQ from './pages/FAQ';
import Testimonials from './pages/Testimonials';
import Press from './pages/Press';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'donate',
        element: <Donate />,
      },
      {
        path: 'adopt',
        element: <AdoptChild />,
      },
      {
        path: 'ledger',
        element: <Ledger />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'testimonials',
        element: <Testimonials />,
      },
      {
        path: 'press',
        element: <Press />,
      },
      {
        path: 'programs/scholarships',
        element: <Scholarships />,
      },
      {
        path: 'programs/support',
        element: <Support />,
      },
      {
        path: 'programs/structure',
        element: <Structure />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
