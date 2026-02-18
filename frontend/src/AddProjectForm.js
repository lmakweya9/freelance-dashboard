import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Briefcase, Layout, Send, DollarSign, Loader2 } from 'lucide-react';

const AddProjectForm = ({ clients, onProjectAdded, darkMode }) => {
    const [formData, setFormData] = useState({ title: '', client_id: '', budget: '' });
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    const theme = {
        card: darkMode ? 'rgba(30, 30, 30, 0.8)' : '#ffffff',
        text: darkMode ? '#e0e0e0' : '#333',
        inputBg: darkMode ? '#2a2a2a' : '#f9f9f9',
        inputBorder: darkMode ? '#444' : '#ddd',
        accent: '#28a745'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client_id) return alert("Select a client!");
        setLoading(true);
        
        try {
            await axios.post(`${API_URL}/projects/`, {
                ...formData,
                budget: parseFloat(formData.budget) || 0
            });
            
            // Automatic cleanup
            setFormData({ title: '', client_id: '', budget: '' });
            onProjectAdded(); 
        } catch (err) { 
            alert("Error: " + (err.response?.data?.detail || "Could not create project")); 
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 12px 12px 40px', marginBottom: '12px',
        borderRadius: '8px', border: `1px solid ${theme.inputBorder}`,
        backgroundColor: theme.inputBg, color: theme.text, outline: 'none', boxSizing: 'border-box'
    };

    return (
        <div style={{ backgroundColor: theme.card, color: theme.text, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.inputBorder}`, backdropFilter: 'blur(10px)' }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PlusCircle size={20} color={theme.accent} /> New Project
            </h3>
            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <Briefcase size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                    <select style={inputStyle} value={formData.client_id} onChange={(e) => setFormData({...formData, client_id: e.target.value})} disabled={loading} required>
                        <option value="">Assign to Client...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div style={{ position: 'relative' }}>
                    <Layout size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                    <input style={inputStyle} placeholder="Project Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} disabled={loading} required />
                </div>
                <div style={{ position: 'relative' }}>
                    <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
                    <input type="number" style={inputStyle} placeholder="Budget (R)" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} disabled={loading} required />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#555' : theme.accent, color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {loading ? "Creating..." : "Create Project"}
                </button>
            </form>
        </div>
    );
};

export default AddProjectForm;
