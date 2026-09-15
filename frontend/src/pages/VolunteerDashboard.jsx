import React, { useState, useEffect } from 'react';

export default function VolunteerDashboard() {
  const [availablePickups, setAvailablePickups] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loadingError, setLoadingError] = useState('');
  const volunteerName = localStorage.getItem('user') || 'Volunteer';

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/donations/admin-summary/');
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      
      const data = await res.json();
      setLoadingError('');

      const foodList = Array.isArray(data) ? data : (data.donations || data.results || []);

      // Filter claimed items ready for pickup
      const claimed = foodList.filter(item => {
        const status = String(item.status || item.claimStatus || '').toLowerCase();
        return (
          status.includes('claim') || 
          status.includes('ngo') || 
          status === 'accept'
        ) && !status.includes('deliver') && !status.includes('picked');
      });

      // Filter active deliveries assigned to or accepted by volunteer
      const active = foodList.filter(item => {
        const status = String(item.status || item.claimStatus || '').toLowerCase();
        return (
          status.includes('accepted') || 
          status.includes('picked') || 
          status.includes('way')
        );
      });

      setAvailablePickups(claimed);
      setActiveDeliveries(active);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setLoadingError('Failed to fetch donations from backend.');
    }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      let res = await fetch(`http://localhost:8000/api/donations/status/${id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, volunteer: volunteerName })
      });

      if (!res.ok) {
        res = await fetch(`http://localhost:8000/api/donations/status/${id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus, volunteer: volunteerName })
        });
      }

      fetchListings();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', color: '#111827', minHeight: '100vh', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0284c7' }}>
          Volunteer Portal
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '2rem' }}>
          Welcome, <strong>{volunteerName}</strong>
        </p>

        {loadingError && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {loadingError}
          </div>
        )}

        {/* Section 1: Available Pickups */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            Available Pickups
          </h2>

          {availablePickups.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No claimed food ready for pickup right now.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {availablePickups.map((item) => {
                const itemId = item.id || item._id;
                return (
                  <div key={itemId} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.4rem', color: '#111827', fontSize: '1.2rem', fontWeight: '700' }}>
                        {item.foodName || item.title || item.name || item.food_item}
                      </h3>
                      <p style={{ margin: '0 0 0.2rem', color: '#4b5563', fontSize: '0.95rem' }}>
                        Quantity: <strong>{item.quantity}</strong>
                      </p>
                      <p style={{ margin: '0 0 0.2rem', color: '#6b7280', fontSize: '0.85rem' }}>
                        Donor: {item.donor || 'N/A'}
                      </p>
                      <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                        {item.status || 'CLAIMED'}
                      </span>
                    </div>
                    <button
                      onClick={() => updateStatus(itemId, 'ACCEPTED by volunteer')}
                      style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '0.66rem 1.25rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Accept Pickup
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 2: Active Deliveries */}
        <section>
          <h2 style={{ fontSize: '1.4rem', color: '#1f3737', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            My Active Deliveries
          </h2>

          {activeDeliveries.length === 0 ? (
            <p style={{ color: '#6b7280' }}>You have not accepted any deliveries yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {activeDeliveries.map((item) => {
                const itemId = item.id || item._id;
                return (
                  <div key={itemId} style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.4rem', color: '#111827', fontSize: '1.2rem', fontWeight: '700' }}>
                        {item.foodName || item.title || item.name || item.food_item}
                      </h3>
                      <p style={{ margin: '0 0 0.4rem', color: '#4b5563' }}>
                        Current Status: <span style={{ color: '#0284c7', fontWeight: '700' }}>{item.status}</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {String(item.status).toLowerCase().includes('accept') && (
                        <button onClick={() => updateStatus(itemId, 'PICKED UP')} style={{ backgroundColor: '#a855f7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                          Mark Picked Up
                        </button>
                      )}
                      {String(item.status).toLowerCase().includes('picked') && (
                        <button onClick={() => updateStatus(itemId, 'ON THE WAY')} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                          Mark On the Way
                        </button>
                      )}
                      {String(item.status).toLowerCase().includes('way') && (
                        <button onClick={() => updateStatus(itemId, 'DELIVERED by volunteer')} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}