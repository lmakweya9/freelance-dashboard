import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send } from 'lucide-react'; // Removed unused Mail and Building

const AddClientForm = ({ onClientAdded, darkMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });

    // Ensure this matches your Render URL EXACTLY
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/clients/`, formData);
            
            if (res.status === 200 || res.status === 201) {
                alert("SUCCESS: Client Added!");
                setFormData({ name: '', email: '', company_name: '' });
                onClientAdded();
            }
        } catch (err) {
            console.error("Submit Error:", err);
            const serverMessage = err.response?.data?.detail;
            
            if (serverMessage) {
                alert("SERVER ERROR: " + serverMessage);
            } else {
                alert("CONNECTION ERROR: Cannot reach backend at " + API_URL);
            }
        }
    };

    const inputStyle = {
        width: '100%', 
        padding: '12px', 
        marginBottom: '10px', 
        borderRadius: '8px', 
        border: '1px solid #444', 
        backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9', 
        color: darkMode ? '#fff' : '#000',
        boxSizing: 'border-box'
    };

    return (
        <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #444', backgroundColor: darkMode ? '#1e1e1e' : '#fff' }}>
            <h3 style={{ color: darkMode ? '#fff' : '#000', margin: '0 0 20px 0' }}>
                <UserPlus size={20} style={{ marginRight: '8px' }} /> Add New Client
            </h3>
            <form onSubmit={handleSubmit}>
                <input 
                    style={inputStyle}
                    placeholder="Full Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                />
                <input 
                    style={inputStyle}
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    style={inputStyle}
                    placeholder="Company Name" 
                    value={formData.company_name} 
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})} 
                />
                <button type="submit" style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <Send size={16} /> Save Client
                </button>
            </form>
        </div>
    );
};

export default AddClientForm;
