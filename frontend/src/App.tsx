import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PropertyList from './pages/properties/PropertyList';
import PropertyCreate from './pages/properties/PropertyCreate';
import { useToast } from '@/hooks/use-toast';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const { toast } = useToast();

  if (!token) {
    toast({
      title: 'Authentication Required',
      description: 'Please login to access this page',
      variant: 'destructive',
    });
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PropertyList />
              </PrivateRoute>
            }
          />
          <Route
            path="/properties"
            element={
              <PrivateRoute>
                <PropertyList />
              </PrivateRoute>
            }
          />
          <Route
            path="/properties/create"
            element={
              <PrivateRoute>
                <PropertyCreate />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
