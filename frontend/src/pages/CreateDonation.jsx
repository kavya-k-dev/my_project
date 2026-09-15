import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateDonation() {
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('food_item', foodItem);
    formData.append('quantity', quantity);
    formData.append('address', address);
    formData.append('phone_number', phoneNumber);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/donations/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Food donation posted successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to post donation.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ color: '#10b981' }}>Post Leftover Food</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Food Item Name:</label>
          <input type="text" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div>
          <label>Quantity / Servings:</label>
          <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div>
          <label>Pickup Address:</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div>
          <label>Contact Phone Number:</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. +91 9876543210" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div>
          <label>Food Photo (Optional):</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ marginTop: '5px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Donation
        </button>
      </form>
    </div>
  );
}