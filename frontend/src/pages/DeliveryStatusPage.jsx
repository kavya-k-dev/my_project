import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Helper function to map raw status string to exact lifecycle labels
const formatStatus = (statusStr = '') => {
  const lower = statusStr.toLowerCase();
  
  if (lower.includes('delivered')) {
    return { label: 'Delivered', color: '#15803d', bg: '#dcfce7' };
  }
  if (lower.includes('on_the_way') || lower.includes('in_transit')) {
    return { label: 'On the Way', color: '#0369a1', bg: '#e0f2fe' };
  }
  if (lower.includes('picked_up')) {
    return { label: 'Picked Up', color: '#6b21a8', bg: '#f3e8ff' };
  }
  if (lower.includes('accepted')) {
    return { label: 'Accepted', color: '#1e40af', bg: '#dbeafe' };
  }
  if (lower.includes('claimed') || lower.includes('accept')) {
    return { label: 'Accept', color: '#854d0e', bg: '#fef08a' };
  }
  
  return { label: 'Available', color: '#b45309', bg: '#fef3c7' };
};

export default function DeliveryStatusPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donations/admin-summary/');
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2.5rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Live Delivery Status Tracker</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Real-time updates visible to Donors, NGOs, Volunteers, and Admins.</p>

        {loading ? (
          <p>Loading tracking data...</p>
        ) : donations.length === 0 ? (
          <p style={{ color: '#64748b' }}>No active donations to track right now.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {donations.map((d) => {
              const statusInfo = formatStatus(d.status);
              return (
                <div key={d.id} style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  {d.image_url ? (
                    <img src={d.image_url} alt={d.food_item} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem' }}>No Image</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{d.food_item}</h3>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.9rem' }}>
                      Quantity: <strong>{d.quantity}</strong> | Donor: <strong>{d.donor_name}</strong>
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Current Status: <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '12px', 
                        fontWeight: 'bold', 
                        fontSize: '0.85rem',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color
                      }}>
                        {statusInfo.label}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}