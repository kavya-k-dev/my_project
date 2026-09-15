import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RecipientPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentRecipient = localStorage.getItem('user') || 'Anonymous Recipient';

  const fetchDonations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donations/admin-summary/');
      const available = res.data.donations.filter(d => d.status.toLowerCase() === 'available');
      setDonations(available);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleClaim = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/donations/claim/${id}/`, {
        recipient_name: currentRecipient
      });
      alert('Food claimed successfully!');
      fetchDonations();
    } catch (err) {
      alert('Failed to claim donation.');
    }
  };

  return (
    <div style={{ padding: '2.5rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Available Food Listings</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Logged in as Recipient: <strong>{currentRecipient}</strong></p>

        {loading ? (
          <p>Loading available food...</p>
        ) : donations.length === 0 ? (
          <p style={{ color: '#64748b' }}>No active food donations available right now.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {donations.map((d) => (
              <div key={d.id} style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {d.image_url ? (
                  <img src={d.image_url} alt={d.food_item} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                ) : (
                  <div style={{ width: '90px', height: '90px', backgroundColor: '#e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem' }}>No Image</div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{d.food_item}</h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>Quantity: <strong>{d.quantity}</strong> | Donor: <strong>{d.donor_name}</strong></p>
                  {d.phone && <p style={{ margin: 0, color: '#0284c7', fontSize: '0.85rem' }}>📞 {d.phone}</p>}
                </div>
                <button 
                  onClick={() => handleClaim(d.id)} 
                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Claim Food
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}