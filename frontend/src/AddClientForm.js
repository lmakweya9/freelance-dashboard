import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send, Mail, Building } from 'lucide-react';

const AddClientForm = ({ onClientAdded, darkMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company_name: ''
    });

    // Ensure this matches your Render URL EXACTLY (no trailing slash)
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    const theme = {
        card: darkMode ? 'rgba(30, 30, 30, 0.8)' : '#ffffff',
        text: darkMode ? '#e0e0e0' : '#333',
        inputBg: darkMode ? '#2a2a2a' : '#f9f9f9',
        inputBorder: darkMode ? '#444' : '#ddd',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // We use a full URL string to ensure no localhost mixups
            const response = await axios.post(`${API_URL}/clients/`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.status === 200 || response.status === 201) {
                alert("✅ Client saved!");
                setFormData({ name: '', email: '', company_name: '' });
                onClientAdded();
            }
        } catch (err) {
            console.error("DEBUG INFO:", err);
            
            // This will tell us if it's a 404 (wrong URL), 400 (duplicate), or 500 (server crash)
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            if (status === 400) {
                alert(`Data Error: ${detail || "Email already exists"}`);
            } else if (status === 404) {
                alert("Error 404: The backend URL is incorrect. Check your Vercel Environment Variables.");
            } else {
                alert("Connection Error: Is the backend awake? (Check console for logs)");
            }
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 12px 12px 40px', marginBottom: '12px',
        borderRadius: '8px', border: `1px solid ${theme.inputBorder}`,
        backgroundColor: theme.inputBg, color: theme.text, fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box'
    };

    return (
        <div style={{ backgroundColor: theme.card, color: theme.text, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.inputBorder}` }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={20} color="#007bff" /> Add New Client
            </h3>
            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <UserPlus size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                    <input style={inputStyle} placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                    <input style={inputStyle} type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div style={{ position: 'relative' }}>
                    <Building size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                    <input style={inputStyle} placeholder="Company Name" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <Send size={16} /> Save Client
                </button>
            </form>
        </div>
    );
};

export default AddClientForm;
