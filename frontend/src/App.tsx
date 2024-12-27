import React from 'react';
import './styles/fonts.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PropertyList from './pages/properties/PropertyList';
import PropertyCreate from './pages/properties/PropertyCreate';
import PropertyDetails from './pages/properties/PropertyDetails';
import { useToast } from '@/hooks/use-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-steel-blue"></div>
      <p className="text-dark-gray">Loading...</p>
    </div>
  </div>
);

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
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
        <React.Suspense fallback={<LoadingSpinner />}>
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
            <Route
              path="/properties/:id"
              element={
                <PrivateRoute>
                  <PropertyDetails />
                </PrivateRoute>
              }
            />
          </Routes>
        </React.Suspense>
      </Layout>
    </Router>
  );
};

export default App;
