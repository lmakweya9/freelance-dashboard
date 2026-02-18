import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send, Mail, Building } from 'lucide-react';

const AddClientForm = ({ onClientAdded, darkMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });

    // This ensures we are NOT hitting localhost anymore
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Using the full dynamic URL
            const res = await axios.post(`${API_URL}/clients/`, formData);
            
            if (res.status === 200 || res.status === 201) {
                alert("SUCCESS: Client Added!");
                setFormData({ name: '', email: '', company_name: '' });
                onClientAdded();
            }
        } catch (err) {
            // NEW ERROR LOGIC: This will tell us if it's a real database error or a connection error
            console.error("Submit Error:", err);
            const serverMessage = err.response?.data?.detail;
            
            if (serverMessage) {
                alert("SERVER ERROR: " + serverMessage);
            } else {
                alert("CONNECTION ERROR: Cannot reach backend at " + API_URL);
            }
        }
    };

    // ... (keep your existing inputStyle and iconWrapper logic here) ...

    return (
        <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #444', backgroundColor: darkMode ? '#1e1e1e' : '#fff' }}>
            <h3 style={{ color: darkMode ? '#fff' : '#000' }}><UserPlus size={20} /> Add New Client</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9', color: darkMode ? '#fff' : '#000' }}
                    placeholder="Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                />
                <input 
                    style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9', color: darkMode ? '#fff' : '#000' }}
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9', color: darkMode ? '#fff' : '#000' }}
                    placeholder="Company" 
                    value={formData.company_name} 
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})} 
                />
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Send size={16} /> Save Client
                </button>
            </form>
        </div>
    );
};

export default AddClientForm;
