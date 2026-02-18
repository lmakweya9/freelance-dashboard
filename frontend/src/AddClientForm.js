import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send, Mail, Building } from 'lucide-react';

const AddClientForm = ({ onClientAdded, darkMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company_name: ''
    });

    // Use Environment Variable for the live Render URL
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    // Dynamic Theme Styling
    const theme = {
        card: darkMode ? 'rgba(30, 30, 30, 0.8)' : '#ffffff',
        text: darkMode ? '#e0e0e0' : '#333',
        inputBg: darkMode ? '#2a2a2a' : '#f9f9f9',
        inputBorder: darkMode ? '#444' : '#ddd',
        inputFocus: '#007bff'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // UPDATED: Points to the live API_URL instead of 127.0.0.1
            const response = await axios.post(`${API_URL}/clients/`, formData);
            
            if (response.status === 200 || response.status === 201) {
                alert("Client added successfully!");
                setFormData({ name: '', email: '', company_name: '' });
                onClientAdded();
            }
        } catch (err) {
            // UPDATED: Better error handling to show what actually happened
            const errorMsg = err.response?.data?.detail || "Connection to server failed.";
            alert("Error: " + errorMsg);
            console.error("Submission Error:", err);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 12px 12px 40px',
        marginBottom: '12px',
        borderRadius: '8px',
        border: `1px solid ${theme.inputBorder}`,
        backgroundColor: theme.inputBg,
        color: theme.text,
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: '0.3s'
    };

    const iconWrapper = {
        position: 'absolute',
        left: '12px',
        top: '12px',
        color: darkMode ? '#888' : '#aaa'
    };

    return (
        <div style={{ 
            backgroundColor: theme.card, 
            color: theme.text, 
            padding: '24px', 
            borderRadius: '16px', 
            border: `1px solid ${theme.inputBorder}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
        }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={20} color="#007bff" /> Add New Client
            </h3>
            
            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <div style={iconWrapper}><UserPlus size={18} /></div>
                    <input 
                        style={inputStyle}
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={iconWrapper}><Mail size={18} /></div>
                    <input 
                        style={inputStyle}
                        type="email"
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <div style={iconWrapper}><Building size={18} /></div>
                    <input 
                        style={inputStyle}
                        placeholder="Company Name (Optional)" 
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    />
                </div>

                <button type="submit" style={btnStyle}>
                    <Send size={16} /> Save Client
                </button>
            </form>
        </div>
    );
};

const btnStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: '0.2s'
};

export default AddClientForm;
