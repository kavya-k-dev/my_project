import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: {}, donations: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donations/admin-summary/');
      setData(res.data);
    } catch (err) {
      console.error("Error fetching admin summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/donations/delete/${id}/`);
      fetchData();
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/donations/delete-user/${userId}/`);
      fetchData();
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;

  const { stats, donations } = data;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0 }}>Admin Overview</h2>
          <button 
            onClick={fetchData}
            style={{ 
              backgroundColor: '#0284c7', 
              color: '#fff', 
              border: 'none', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold' 
            }}
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={cardStyle}>
            <span style={cardTitle}>TOTAL DONATIONS</span>
            <span style={cardValue}>{stats.totalDonations || 0}</span>
          </div>
          <div style={cardStyle}>
            <span style={cardTitle}>PENDING / IN PROGRESS</span>
            <span style={cardValue}>{stats.inTransitPending || 0}</span>
          </div>
          <div style={cardStyle}>
            <span style={cardTitle}>SUCCESSFULLY DELIVERED</span>
            <span style={cardValue}>{stats.successfullyDelivered || 0}</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>FOOD IMAGE</th>
                <th style={thStyle}>FOOD DESCRIPTION</th>
                <th style={thStyle}>QUANTITY</th>
                <th style={thStyle}>STATUS</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle}>
                    {d.image_url ? (
                      <img 
                        src={d.image_url} 
                        alt={d.food_item} 
                        style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
                      />
                    ) : (
                      <div style={{ width: '110px', height: '110px', backgroundColor: '#e2e8f0', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 'bold' }}>No Image</div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem' }}>{d.food_item}</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Donor: <strong>{d.donor_name}</strong></div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: '1.05rem', fontWeight: '500' }}>{d.quantity}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '16px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      backgroundColor: d.status.toLowerCase().includes('delivered') ? '#dcfce7' : d.status.toLowerCase().includes('claimed') ? '#e0f2fe' : '#fef3c7',
                      color: d.status.toLowerCase().includes('delivered') ? '#15803d' : d.status.toLowerCase().includes('claimed') ? '#0369a1' : '#b45309'
                    }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => handleDeleteItem(d.id)} style={{ backgroundColor: '#fecdd3', color: '#be123c', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Delete Item</button>
                    {d.donor_id && (
                      <button onClick={() => handleDeleteUser(d.donor_id)} style={{ backgroundColor: '#881337', color: '#fff', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Delete User</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const cardTitle = { fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' };
const cardValue = { fontSize: '2.2rem', fontWeight: 'bold', color: '#0f172a' };
const thStyle = { padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#475569', fontWeight: 'bold' };
const tdStyle = { padding: '1rem 1.25rem', verticalAlign: 'middle' };