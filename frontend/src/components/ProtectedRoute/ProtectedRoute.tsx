// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const storedUser = localStorage.getItem('userStore');
    const user = storedUser ? JSON.parse(storedUser) : null;
  
    return user?.userId ? children : <Navigate to="/auth" replace />;
  };
  

export default ProtectedRoute;
