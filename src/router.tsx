import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
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
        path: '*',
        element: <NotFound />,
      }
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;