import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formatStatus = (statusStr = '') => {
  const lower = statusStr.toLowerCase();
  
  if (lower.includes('delivered')) return { label: 'Delivered', color: '#15803d', bg: '#dcfce7' };
  if (lower.includes('on_the_way') || lower.includes('in_transit')) return { label: 'On the Way', color: '#0369a1', bg: '#e0f2fe' };
  if (lower.includes('picked_up')) return { label: 'Picked Up', color: '#6b21a8', bg: '#f3e8ff' };
  if (lower.includes('accepted')) return { label: 'Accepted', color: '#1e40af', bg: '#dbeafe' };
  if (lower.includes('claimed') || lower.includes('accept')) return { label: 'Accept', color: '#854d0e', bg: '#fef08a' };
  
  return { label: 'Available', color: '#b45309', bg: '#fef3c7' };
};

export default function VolunteerPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentVolunteer = localStorage.getItem('user') || 'Volunteer';

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donations/admin-summary/');
      setDeliveries(res.data.donations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/donations/status/${id}/`, {
        status: newStatus
      });
      fetchDeliveries();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: '2.5rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Volunteer Delivery Dashboard</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Logged in as: <strong>{currentVolunteer}</strong></p>

        {loading ? (
          <p>Loading active deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p style={{ color: '#64748b' }}>No deliveries available right now.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {deliveries.map((d) => {
              const statusInfo = formatStatus(d.status);
              const lowerStatus = d.status.toLowerCase();

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
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>
                      Current Status: <span style={{ padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 'bold', backgroundColor: statusInfo.bg, color: statusInfo.color }}>{statusInfo.label}</span>
                    </p>
                    {d.phone && <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>📞 Contact: {d.phone}</p>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Action 1: Accept order */}
                    {(lowerStatus.includes('claimed') || lowerStatus.includes('accept') && !lowerStatus.includes('accepted')) && (
                      <button 
                        onClick={() => handleUpdateStatus(d.id, `ACCEPTED by ${currentVolunteer}`)}
                        style={{ backgroundColor: '#1e40af', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Accept Order
                      </button>
                    )}

                    {/* Action 2: Pick up item */}
                    {lowerStatus.includes('accepted') && !lowerStatus.includes('picked_up') && (
                      <button 
                        onClick={() => handleUpdateStatus(d.id, `PICKED_UP by ${currentVolunteer}`)}
                        style={{ backgroundColor: '#6b21a8', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Pick Up Item
                      </button>
                    )}

                    {/* Action 3: Start Delivery */}
                    {lowerStatus.includes('picked_up') && (
                      <button 
                        onClick={() => handleUpdateStatus(d.id, `ON_THE_WAY by ${currentVolunteer}`)}
                        style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Start Delivery
                      </button>
                    )}

                    {/* Action 4: Mark as Delivered */}
                    {(lowerStatus.includes('on_the_way') || lowerStatus.includes('in_transit')) && (
                      <button 
                        onClick={() => handleUpdateStatus(d.id, `DELIVERED by ${currentVolunteer}`)}
                        style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Mark as Delivered
                      </button>
                    )}

                    {/* Complete State */}
                    {lowerStatus.includes('delivered') && (
                      <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>✓ Completed</span>
                    )}
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