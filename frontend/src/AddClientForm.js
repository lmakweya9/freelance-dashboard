import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const AddClientForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://freelance-api-xyz.onrender.com/clients/', formData);
            onSuccess();
        } catch (err) { alert("Error adding client"); }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '15px', width: '350px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>New Client</h3>
                    <X onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Client Name" required style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#121212', color: 'white', border: '1px solid #444', borderRadius: '5px' }} 
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input placeholder="Email Address" required style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#121212', color: 'white', border: '1px solid #444', borderRadius: '5px' }} 
                        onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input placeholder="Company Name" style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#121212', color: 'white', border: '1px solid #444', borderRadius: '5px' }} 
                        onChange={e => setFormData({...formData, company_name: e.target.value})} />
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Save Client</button>
                </form>
            </div>
        </div>
    );
};

export default AddClientForm;
