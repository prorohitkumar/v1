import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  // Check if token exists in local storage
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthGuard;
