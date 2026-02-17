import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, Trash2, FolderKanban, CheckCircle, Clock, Sun, Moon } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    // Dynamic Colors
    const theme = {
        bg: darkMode ? '#121212' : '#f8f9fa',
        card: darkMode ? '#1e1e1e' : '#ffffff',
        text: darkMode ? '#e0e0e0' : '#333333',
        border: darkMode ? '#333333' : '#e0e0e0',
        accent: '#007bff'
    };

    const fetchClients = async () => {
        const res = await axios.get('http://127.0.0.1:8000/clients/');
        setClients(res.data);
    };

    const toggleStatus = async (id) => {
        await axios.patch(`http://127.0.0.1:8000/projects/${id}/status`);
        fetchClients();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete client?")) {
            await axios.delete(`http://127.0.0.1:8000/clients/${id}`);
            fetchClients();
        }
    };

    useEffect(() => { fetchClients(); }, []);

    return (
        <div style={{ 
            backgroundColor: theme.bg, 
            color: theme.text, 
            minHeight: '100vh', 
            transition: '0.3s all ease',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header with Toggle */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                        <Briefcase size={32} color={theme.accent} /> Freelance Hub
                    </h1>
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        style={{ 
                            background: theme.card, 
                            color: theme.text, 
                            border: `1px solid ${theme.border}`,
                            padding: '10px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchClients} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchClients} darkMode={darkMode} />
                </div>

                <h2 style={{ borderBottom: `2px solid ${theme.border}`, paddingBottom: '10px', marginBottom: '20px' }}>Active Clients</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {clients.map(c => (
                        <div key={c.id} style={{ 
                            backgroundColor: theme.card, 
                            border: `1px solid ${theme.border}`, 
                            padding: '24px', 
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: theme.accent }}><Users size={18} /> {c.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: darkMode ? '#aaa' : '#666', marginTop: '5px' }}>{c.email}</p>
                                </div>
                                <Trash2 size={18} color="#ff4d4d" onClick={() => handleDelete(c.id)} style={{ cursor: 'pointer' }} />
                            </div>

                            <div style={{ marginTop: '20px', borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}><FolderKanban size={16} /> Projects</h4>
                                {c.projects.map(p => (
                                    <div key={p.id} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        marginBottom: '10px',
                                        padding: '8px 12px',
                                        backgroundColor: darkMode ? '#2a2a2a' : '#f1f3f5',
                                        borderRadius: '8px'
                                    }}>
                                        <span style={{ fontSize: '0.85rem' }}>{p.title}</span>
                                        <button 
                                            onClick={() => toggleStatus(p.id)} 
                                            style={{ 
                                                fontSize: '0.7rem', 
                                                cursor: 'pointer', 
                                                borderRadius: '6px', 
                                                border: 'none',
                                                padding: '4px 8px',
                                                fontWeight: 'bold',
                                                backgroundColor: p.status === 'Completed' ? '#28a745' : theme.accent,
                                                color: '#fff'
                                            }}
                                        >
                                            {p.status === 'Completed' ? <CheckCircle size={12} /> : <Clock size={12} />} {p.status}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;