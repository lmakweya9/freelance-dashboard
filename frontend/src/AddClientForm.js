import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send, Loader2 } from 'lucide-react'; 

const AddClientForm = ({ onClientAdded, darkMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });
    const [loading, setLoading] = useState(false); // Added a loading state for better "automatic" feel

    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start "automatic" process
        
        try {
            const res = await axios.post(`${API_URL}/clients/`, formData);
            
            if (res.status === 200 || res.status === 201) {
                // SUCCESS: Clear form and refresh list without annoying alerts
                setFormData({ name: '', email: '', company_name: '' });
                onClientAdded(); 
            }
        } catch (err) {
            console.error("Submit Error:", err);
            // We only show an alert if something actually goes WRONG
            const serverMessage = err.response?.data?.detail;
            alert(serverMessage || "Connection Error. Please try again.");
        } finally {
            setLoading(false); // End process
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
                    disabled={loading}
                />
                <input 
                    style={inputStyle}
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                    disabled={loading}
                />
                <input 
                    style={inputStyle}
                    placeholder="Company Name" 
                    value={formData.company_name} 
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})} 
                    disabled={loading}
                />
                <button type="submit" disabled={loading} style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: loading ? '#555' : '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
                    {loading ? "Saving..." : "Save Client"}
                </button>
            </form>
        </div>
    );
};

export default AddClientForm;
