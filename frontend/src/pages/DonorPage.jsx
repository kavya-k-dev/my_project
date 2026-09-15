import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DonorPage() {
  const currentUser = localStorage.getItem('user') || '';
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [userDonations, setUserDonations] = useState([]);

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/donations/admin-summary/');
      const myItems = res.data.donations.filter(d => d.donor_name === currentUser);
      setUserDonations(myItems);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdmin) {
      alert('Admins are restricted from creating donations.');
      return;
    }

    const formData = new FormData();
    formData.append('food_item', foodItem);
    formData.append('quantity', quantity);
    formData.append('phone', phone);
    formData.append('donor_name', currentUser); // FIX: Sends actual logged in donor username
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/donations/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Donation submitted successfully!');
      setFoodItem('');
      setQuantity('');
      setPhone('');
      setImage(null);
      fetchMyDonations();
    } catch (err) {
      alert('Failed to submit donation.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/donations/delete-donation/${id}/`);
      fetchMyDonations();
    } catch (err) {
      alert('Failed to delete donation.');
    }
  };

  if (isAdmin) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#dc2626' }}>Access Restricted</h2>
        <p style={{ color: '#475569' }}>You are logged in as <strong>Admin</strong>. Admins cannot make donations.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem', fontFamily: 'Inter, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ marginTop: 0, color: '#0f172a' }}>Donate Food (Logged in as: {currentUser || 'Guest'})</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Food Item (e.g., Dosa)" 
              required 
              value={foodItem} 
              onChange={e => setFoodItem(e.target.value)} 
              style={inputStyle} 
            />
            <input 
              type="text" 
              placeholder="Quantity (e.g., 5 plates)" 
              required 
              value={quantity} 
              onChange={e => setQuantity(e.target.value)} 
              style={inputStyle} 
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              style={inputStyle} 
            />
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Upload Food Image:</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setImage(e.target.files[0])} 
                style={{ fontSize: '0.9rem' }} 
              />
            </div>
            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Submit Donation
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>My Submitted Donations</h3>
          {userDonations.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No active donations submitted yet under {currentUser}.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {userDonations.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.2rem 0', color: '#1e293b' }}>{item.food_item}</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Quantity: {item.quantity} | Status: <strong style={{ color: '#2563eb' }}>{item.status}</strong></p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const inputStyle = { padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.95rem' };