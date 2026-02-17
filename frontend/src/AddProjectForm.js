import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, Briefcase, Layout, Send } from 'lucide-react';

const AddProjectForm = ({ clients, onProjectAdded, darkMode }) => {
    const [formData, setFormData] = useState({
        title: '',
        client_id: ''
    });

    // Dynamic Theme Styling
    const theme = {
        card: darkMode ? 'rgba(30, 30, 30, 0.8)' : '#ffffff',
        text: darkMode ? '#e0e0e0' : '#333',
        inputBg: darkMode ? '#2a2a2a' : '#f9f9f9',
        inputBorder: darkMode ? '#444' : '#ddd',
        accent: '#28a745' // Green for "Projects" to differentiate from "Clients"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client_id) {
            alert("Please select a client first!");
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/projects/', formData);
            setFormData({ title: '', client_id: '' });
            onProjectAdded();
        } catch (err) {
            console.error(err);
            alert("Error adding project");
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
        appearance: 'none', // Removes default browser styling for select
        transition: '0.3s'
    };

    const iconWrapper = {
        position: 'absolute',
        left: '12px',
        top: '12px',
        color: darkMode ? '#888' : '#aaa',
        zIndex: 1
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
                <PlusCircle size={20} color={theme.accent} /> New Project
            </h3>
            
            <form onSubmit={handleSubmit}>
                {/* Client Dropdown */}
                <div style={{ position: 'relative' }}>
                    <div style={iconWrapper}><Briefcase size={18} /></div>
                    <select 
                        style={inputStyle}
                        value={formData.client_id}
                        onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                        required
                    >
                        <option value="" disabled style={{color: '#888'}}>Assign to Client...</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id} style={{backgroundColor: theme.card, color: theme.text}}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Project Title Input */}
                <div style={{ position: 'relative' }}>
                    <div style={iconWrapper}><Layout size={18} /></div>
                    <input 
                        style={inputStyle}
                        placeholder="Project Name (e.g. Website Redesign)" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                <button type="submit" style={btnStyle(theme.accent)}>
                    <Send size={16} /> Create Project
                </button>
            </form>
        </div>
    );
};

const btnStyle = (color) => ({
    width: '100%',
    padding: '12px',
    backgroundColor: color,
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
});

export default AddProjectForm;