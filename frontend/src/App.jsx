import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BookTable from './pages/customer/BookTable';
import MyReservations from './pages/customer/MyReservations';
import AllReservations from './pages/admin/AllReservations';
import ManageTables from './pages/admin/ManageTables';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content-viewport">
          <Routes>
            {/* Sahi Routes Vector */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customers Area */}
            <Route 
              path="/customer/book" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <BookTable />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/reservations" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <MyReservations />
                </ProtectedRoute>
              } 
            />

            {/* Admin Area */}
            <Route 
              path="/admin/reservations" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllReservations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/tables" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageTables />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;