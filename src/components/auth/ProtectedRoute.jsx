import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return children;
};

export default ProtectedRoute;
