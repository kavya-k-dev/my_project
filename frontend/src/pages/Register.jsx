import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register({ setRole }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('donor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) return alert('Please enter a username');

    localStorage.setItem('userRole', selectedRole);
    localStorage.setItem('user', username);
    setRole(selectedRole);

    if (selectedRole === 'donor') navigate('/donate');
    else if (selectedRole === 'recipient') navigate('/claim');
    else if (selectedRole === 'volunteer') navigate('/volunteer');
    else if (selectedRole === 'admin') navigate('/admin');
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .hero-glow-1 {
          position: absolute; top: -10%; left: 20%; width: 400px; height: 400px;
          background: rgba(56, 189, 248, 0.15); filter: blur(120px); border-radius: 50%;
          animation: pulseGlow 6s infinite ease-in-out; pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute; bottom: 10%; right: 15%; width: 450px; height: 450px;
          background: rgba(168, 85, 247, 0.12); filter: blur(140px); border-radius: 50%;
          animation: pulseGlow 8s infinite ease-in-out; pointer-events: none;
        }
        .modal-animated {
          animation: modalFadeIn 0.25s ease-out forwards;
        }
      `}</style>

      <div className="hero-glow-1" />
      <div className="hero-glow-2" />

      {/* Styled Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 3rem', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>✨</span>
          <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Leftover <span style={{ color: '#38bdf8' }}>to Lifeline</span>
          </span>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.4rem',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
          }}
        >
          🔑 Login / Register
        </button>
      </header>

      {/* Clean Hero Main View */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <span style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          REDUCING WASTE • SAVING LIVES
        </span>

        <h1 style={{ fontSize: '4.2rem', fontWeight: '900', margin: '2rem 0 1.2rem', lineHeight: '1.1' }}>
          Bridging Food Surplus to <br />
          <span style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            People in Need
          </span>
        </h1>

        <p style={{ color: '#9ca3af', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto' }}>
          Real-time food distribution platform connecting Donors, NGOs, and Volunteers seamlessly.
        </p>
      </main>

      {/* Modal Popup */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 100, backdropFilter: 'blur(6px)'
        }}>
          <div className="modal-animated" style={{
            backgroundColor: '#ffffff', color: '#111827',
            padding: '2.5rem', borderRadius: '16px',
            width: '90%', maxWidth: '400px', position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#6b7280' }}
            >
              ✕
            </button>

            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: '800' }}>Login / Register</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>Access your portal to continue</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}>Role</label>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem' }}
                >
                  <option value="donor">Donor</option>
                  <option value="recipient">NGO / Recipient</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}>Username</label>
                <input 
                  type="text" 
                  placeholder="Enter username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '700' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1rem', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit"
                style={{
                  backgroundColor: '#0284c7', color: '#fff',
                  border: 'none', padding: '0.85rem',
                  borderRadius: '8px', fontSize: '1rem',
                  fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem'
                }}
              >
                Access Platform
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}