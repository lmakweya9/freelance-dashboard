import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, PlusCircle, Loader2 } from 'lucide-react';

const AddProjectForm = ({ clients, onProjectAdded, darkMode }) => {
    const [formData, setFormData] = useState({ title: '', budget: '', client_id: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client_id) return alert("Select a client first!");
        setIsSaving(true);
        try {
            await axios.post('https://freelance-api-xyz.onrender.com/projects/', {
                ...formData,
                budget: parseFloat(formData.budget) || 0
            });
            setFormData({ title: '', budget: '', client_id: '' });
            onProjectAdded();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
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
                <PlusCircle size={20} color="#28a745" />
                <h3 style={{ margin: 0 }}>New Project</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <select value={formData.client_id} required style={inputStyle}
                    onChange={(e) => setFormData({...formData, client_id: e.target.value})}>
                    <option value="">Assign to Client...</option>
                    {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" placeholder="Project Title" value={formData.title} required
                    onChange={(e) => setFormData({...formData, title: e.target.value})} style={inputStyle} />
                <input type="number" placeholder="Budget (R)" value={formData.budget} required
                    onChange={(e) => setFormData({...formData, budget: e.target.value})} style={inputStyle} />
                <button 
                    type="submit" 
                    disabled={isSaving} 
                    style={{ 
                        width: '100%', padding: '12px', backgroundColor: isSaving ? '#555' : '#28a745', 
                        color: 'white', border: 'none', borderRadius: '8px', cursor: isSaving ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                    }}
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Briefcase size={18} />}
                    {isSaving ? 'Creating...' : 'Create Project'}
                </button>
            </form>
        </div>
    );
};

export default AddProjectForm;
