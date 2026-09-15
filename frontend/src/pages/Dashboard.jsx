import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donations/');
      setDonations(res.data);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  };

  const handleClaim = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/donations/${id}/claim/`);
      alert('Food claimed successfully!');
      fetchDonations();
    } catch (err) {
      console.error('Error claiming donation:', err);
      alert('Failed to claim food.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/donations/${id}/`);
      alert('Donation deleted.');
      fetchDonations();
    } catch (err) {
      console.error('Error deleting donation:', err);
      alert('Failed to delete donation.');
    }
  };

  const filteredDonations = donations.filter((item) => {
    if (filter === 'available') return item.status === 'available' || !item.status;
    if (filter === 'claimed') return item.status === 'claimed';
    return true;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
        <h2 style={{ margin: 0, color: '#10b981' }}>💚 Leftover to Lifeline</h2>
        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }} 
          style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      <main style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Food Donations</h3>
          <button 
            onClick={() => navigate('/create-donation')} 
            style={{ padding: '10px 18px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Post Leftover Food
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['all', 'available', 'claimed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1px solid #d1d5db',
                backgroundColor: filter === tab ? '#10b981' : '#f3f4f6',
                color: filter === tab ? '#fff' : '#374151',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredDonations.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>No donations posted yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {filteredDonations.map((item) => (
              <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {item.image && (
                    <img 
                      src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`} 
                      alt={item.food_item} 
                      style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                  )}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                      {item.food_item}{' '}
                      <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '12px', backgroundColor: item.status === 'claimed' ? '#fee2e2' : '#d1fae5', color: item.status === 'claimed' ? '#991b1b' : '#065f46', marginLeft: '8px' }}>
                        {item.status ? item.status.toUpperCase() : 'AVAILABLE'}
                      </span>
                    </h4>
                    <p style={{ margin: '4px 0', color: '#4b5563' }}><strong>Quantity:</strong> {item.quantity}</p>
                    <p style={{ margin: '4px 0', color: '#4b5563' }}><strong>Address:</strong> {item.address}</p>
                    {item.phone_number && (
                      <p style={{ margin: '4px 0', color: '#4b5563' }}><strong>Contact:</strong> 📞 {item.phone_number}</p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  {item.status === 'claimed' ? (
                    <button disabled style={{ padding: '8px 14px', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'not-allowed' }}>
                      Claimed
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleClaim(item.id)}
                      style={{ padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Claim Food
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}