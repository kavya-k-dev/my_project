import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import DonorPage from './pages/DonorPage';
import RecipientPage from './pages/RecipientPage';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryStatusPage from './pages/DeliveryStatusPage';

export default function App() {
  const [role, setRole] = useState(localStorage.getItem('userRole') || '');

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#030712' }}>
        <Navbar setRole={setRole} />
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<Register setRole={setRole} />} />
          <Route path="/donate" element={<DonorPage />} />
          <Route path="/claim" element={<RecipientPage />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/delivery-status" element={<DeliveryStatusPage />} />
        </Routes>
      </div>
    </Router>
  );
}