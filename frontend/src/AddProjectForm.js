import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const AddProjectForm = ({ clientId, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://freelance-api-xyz.onrender.com/projects/', {
                title,
                budget: parseFloat(budget),
                client_id: clientId
            });
            onSuccess(); // Triggers refresh in Dashboard
        } catch (err) { alert("Error adding project"); }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '15px', width: '350px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Assign Project</h3>
                    <X onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Project Title" required style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#121212', color: 'white', border: '1px solid #444', borderRadius: '5px' }} 
                        onChange={e => setTitle(e.target.value)} />
                    <input type="number" placeholder="Budget ($)" required style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#121212', color: 'white', border: '1px solid #444', borderRadius: '5px' }} 
                        onChange={e => setBudget(e.target.value)} />
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>Create Project</button>
                </form>
            </div>
        </div>
    );
};

export default AddProjectForm;
