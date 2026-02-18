import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send } from 'lucide-react';

const AddClientForm = ({ onClientAdded, darkMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://freelance-api-xyz.onrender.com/clients/', formData);
            setFormData({ name: '', email: '', company_name: '' }); // Clear form
            onClientAdded(); // Refresh dashboard list
        } catch (err) {
            alert("Error adding client. Email might already exist.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px',
        border: '1px solid #444', backgroundColor: darkMode ? '#252525' : '#fff',
        color: 'inherit', boxSizing: 'border-box'
    };

    return (
        <div style={{ backgroundColor: darkMode ? '#1e1e1e' : '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <UserPlus size={20} color="#007bff" />
                <h3 style={{ margin: 0 }}>Add New Client</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" value={formData.name} required
                    onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                <input type="email" placeholder="Email Address" value={formData.email} required
                    onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                <input type="text" placeholder="Company Name" value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})} style={inputStyle} />
                <button type="submit" disabled={loading} style={{ 
                    width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', 
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                }}>
                    <Send size={18} /> {loading ? 'Saving...' : 'Save Client'}
                </button>
            </form>
        </div>
    );
};

export default AddClientForm;
