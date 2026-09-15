import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ setRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide global navbar on landing page
  if (location.pathname === '/register' || location.pathname === '/') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    if (setRole) setRole('');
    navigate('/register');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#111827',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f9fafb'
    }}>
      <div 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: '800' }}
      >
        ✨ Leftover <span style={{ color: '#38bdf8' }}>to Lifeline</span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/delivery-status')}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🚚 Live Status
        </button>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}