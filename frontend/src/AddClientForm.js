import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Send, Loader2 } from 'lucide-react';

const AddClientForm = ({ onClientAdded, showToast, darkMode }) => {
    const [formData, setFormData] = useState({ name: '', email: '', company_name: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Pointing to your specific Render backend
            await axios.post('https://freelance-api-xyz.onrender.com/clients/', formData, { timeout: 60000 });
            setFormData({ name: '', email: '', company_name: '' });
            onClientAdded(); // Refresh the list in Dashboard.js
            if(showToast) showToast("Client saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Save failed. The server is still waking up—please wait 10 seconds and click Save again.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px',
        border: '1px solid #444', backgroundColor: darkMode ? '#252525' : '#fff',
        color: 'inherit', boxSizing: 'border-box', outline: 'none'
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
                <button 
                    type="submit" 
                    disabled={isSaving} 
                    style={{ 
                        width: '100%', padding: '12px', backgroundColor: isSaving ? '#444' : '#007bff', 
                        color: 'white', border: 'none', borderRadius: '8px', cursor: isSaving ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                        transition: '0.2s'
                    }}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {isSaving ? 'Processing...' : 'Save Client'}
                </button>
            </form>
        </div>
    );
};

export default AddClientForm;
