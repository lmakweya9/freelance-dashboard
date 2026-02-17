import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Briefcase, Trash2, Search, DollarSign, CheckCircle, Clock, Sun, Moon } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = () => {
    const [clients, setClients] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    useEffect(() => { fetchClients(); }, []);

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

    // LOGIC: Calculate Revenue
    const totalRevenue = clients.reduce((acc, client) => {
        return acc + client.projects.reduce((pAcc, p) => pAcc + (p.budget || 0), 0);
    }, 0);

    // LOGIC: Filter Clients
    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.company_name && c.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: '0.3s', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Briefcase size={32} color={theme.accent} /> Freelance Hub</h1>
                    <button onClick={() => setDarkMode(!darkMode)} style={{ cursor: 'pointer', borderRadius: '50%', padding: '10px', background: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </header>

                {/* Stats & Search Bar Area */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: theme.accent, color: '#fff', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 12px rgba(0,123,255,0.3)' }}>
                        <DollarSign size={32} />
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Total Revenue</p>
                            <h2 style={{ margin: 0 }}>R {totalRevenue.toLocaleString()}</h2>
                        </div>
                    </div>
                    
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search style={{ position: 'absolute', left: '15px', color: '#888' }} />
                        <input 
                            type="text" 
                            placeholder="Search by client or company name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '15px 15px 15px 50px', borderRadius: '16px', border: `1px solid ${theme.border}`, background: theme.card, color: theme.text, fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchClients} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchClients} darkMode={darkMode} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {filteredClients.map(c => (
                        <div key={c.id} style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: theme.accent }}>{c.name}</h3>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.company_name || 'Individual'}</p>
                                </div>
                                <Trash2 size={18} color="#ff4d4d" onClick={() => handleDelete(c.id)} style={{ cursor: 'pointer' }} />
                            </div>

                            <div style={{ marginTop: '15px' }}>
                                {c.projects.map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${theme.border}` }}>
                                        <div onClick={() => toggleStatus(p.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {p.status === 'Completed' ? <CheckCircle size={14} color="#28a745" /> : <Clock size={14} color={theme.accent} />}
                                            <span style={{ fontSize: '0.9rem', textDecoration: p.status === 'Completed' ? 'line-through' : 'none', opacity: p.status === 'Completed' ? 0.5 : 1 }}>{p.title}</span>
                                        </div>
                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>R {p.budget.toLocaleString()}</span>
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