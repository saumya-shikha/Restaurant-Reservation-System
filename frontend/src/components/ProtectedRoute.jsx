import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Re-route dynamically matching fundamental permissions matrix
    return user.role === 'admin' 
      ? <Navigate to="/admin/reservations" replace /> 
      : <Navigate to="/customer/book" replace />;
  }

  return children;
};

export default ProtectedRoute;