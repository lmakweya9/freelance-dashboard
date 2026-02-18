import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, LogOut, Plus, Briefcase, Users, DollarSign, Layers } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [showClientForm, setShowClientForm] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) { console.error("Fetch error"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchClients(); }, []);

    // Calculate quick stats for balance
    const totalRevenue = clients.reduce((acc, client) => 
        acc + (client.projects?.reduce((pAcc, p) => pAcc + p.budget, 0) || 0), 0);
    const totalProjects = clients.reduce((acc, client) => acc + (client.projects?.length || 0), 0);

    return (
        <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#e0e0e0', padding: '2vw', fontFamily: '"Inter", sans-serif' }}>
            
            {/* 1. Header Section */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>Freelance Console</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome back, Admin</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowClientForm(true)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: '0.2s' }}>
                        <Plus size={18} /> New Client
                    </button>
                    <button onClick={() => setToken(null)} style={{ background: '#1a1a1a', color: '#ff4444', border: '1px solid #333', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* 2. Stats Bar (Adds balance to the top) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: '#161616', padding: '20px', borderRadius: '16px', border: '1px solid #222' }}>
                    <div style={{ color: '#666', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16}/> Total Clients</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{clients.length}</div>
                </div>
                <div style={{ background: '#161616', padding: '20px', borderRadius: '16px', border: '1px solid #222' }}>
                    <div style={{ color: '#666', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={16}/> Active Projects</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalProjects}</div>
                </div>
                <div style={{ background: '#161616', padding: '20px', borderRadius: '16px', border: '1px solid #222' }}>
                    <div style={{ color: '#666', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><DollarSign size={16}/> Total Pipeline</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>${totalRevenue.toLocaleString()}</div>
                </div>
            </div>

            {/* 3. Responsive Client Grid */}
            {loading ? <p>Syncing dashboard...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                    {clients.map(client => (
                        <div key={client.id} style={{ backgroundColor: '#161616', borderRadius: '20px', border: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s' }}>
                            <div style={{ padding: '24px', flexGrow: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{client.name}</h3>
                                        <span style={{ fontSize: '0.8rem', color: '#007bff', backgroundColor: '#007bff15', padding: '4px 8px', borderRadius: '6px' }}>{client.company_name}</span>
                                    </div>
                                    <button onClick={() => { if(window.confirm("Delete client?")) axios.delete(`${API_URL}/clients/${client.id}`).then(fetchClients)}} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer' }}><Trash2 size={18}/></button>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#444', fontWeight: 'bold', marginBottom: '10px' }}>Projects</p>
                                    {client.projects && client.projects.length > 0 ? client.projects.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#1c1c1c', padding: '12px', borderRadius: '10px', marginBottom: '8px', border: '1px solid #252525' }}>
                                            <span style={{ fontSize: '0.9rem' }}>{p.title}</span>
                                            <span style={{ color: '#28a745', fontWeight: 'bold' }}>${p.budget}</span>
                                        </div>
                                    )) : <p style={{ color: '#444', fontSize: '0.85rem', fontStyle: 'italic' }}>No active projects</p>}
                                </div>
                            </div>

                            <button onClick={() => setSelectedClientId(client.id)} style={{ width: '100%', background: '#1c1c1c', color: '#fff', border: 'none', borderTop: '1px solid #222', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <Briefcase size={16} /> Assign Project
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showClientForm && <AddClientForm onClose={() => setShowClientForm(false)} onSuccess={() => { setShowClientForm(false); fetchClients(); }} />}
            {selectedClientId && <AddProjectForm clientId={selectedClientId} onClose={() => setSelectedClientId(null)} onSuccess={() => { setSelectedClientId(null); fetchClients(); }} />}
        </div>
    );
};

export default Dashboard;
