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

    const totalRevenue = clients.reduce((acc, client) => 
        acc + (client.projects?.reduce((pAcc, p) => pAcc + p.budget, 0) || 0), 0);
    const totalProjects = clients.reduce((acc, client) => acc + (client.projects?.length || 0), 0);

    return (
        <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#e0e0e0', padding: '2vw', fontFamily: '"Inter", sans-serif' }}>
            
            {/* INJECTED CSS FOR HOVER EFFECTS */}
            <style>{`
                .client-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .client-card:hover {
                    transform: translateY(-8px);
                    border-color: #007bff66 !important;
                    box-shadow: 0 10px 30px -10px rgba(0, 123, 255, 0.3);
                }
                .assign-btn {
                    transition: background 0.2s;
                }
                .client-card:hover .assign-btn {
                    background: #007bff !important;
                }
            `}</style>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>Console</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>Overview of your freelance operations</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowClientForm(true)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                        <Plus size={18} /> New Client
                    </button>
                    <button onClick={() => setToken(null)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ff4444', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <StatCard icon={<Users size={18}/>} label="Clients" val={clients.length} />
                <StatCard icon={<Layers size={18}/>} label="Projects" val={totalProjects} />
                <StatCard icon={<DollarSign size={18}/>} label="Revenue" val={`$${totalRevenue.toLocaleString()}`} color="#28a745" />
            </div>

            {loading ? <p style={{ textAlign: 'center', color: '#444' }}>Syncing data...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                    {clients.map(client => (
                        <div key={client.id} className="client-card" style={{ backgroundColor: '#161616', borderRadius: '24px', border: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', flexGrow: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: '600' }}>{client.name}</h3>
                                        <span style={{ fontSize: '0.75rem', color: '#007bff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{client.company_name}</span>
                                    </div>
                                    <button onClick={() => { if(window.confirm("Delete client?")) axios.delete(`${API_URL}/clients/${client.id}`).then(fetchClients)}} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer' }}><Trash2 size={18}/></button>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    {client.projects && client.projects.length > 0 ? client.projects.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#0f0f0f', padding: '12px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #222' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{p.title}</span>
                                            <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '0.9rem' }}>${p.budget}</span>
                                        </div>
                                    )) : <p style={{ color: '#444', fontSize: '0.85rem', textAlign: 'center', padding: '10px' }}>No active projects</p>}
                                </div>
                            </div>

                            <button className="assign-btn" onClick={() => setSelectedClientId(client.id)} style={{ width: '100%', background: '#1c1c1c', color: '#fff', border: 'none', borderTop: '1px solid #222', padding: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600' }}>
                                <Briefcase size={16} /> Assign Project
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showClientForm && <AddClientForm onClose={() => setShowClientForm(false)} onSuccess={() => { setShowClientForm(false); fetchClients(); }} />}
            {selectedClientId && <AddProjectForm clientId={selectedClientId} onClose={() => setSelectedClientId(null)} onSuccess={() => { setSelectedClientId(null); fetchClients(); }} />}
        </div>
    );
};

// Sub-component for clean code
const StatCard = ({ icon, label, val, color="#fff" }) => (
    <div style={{ background: '#161616', padding: '24px', borderRadius: '20px', border: '1px solid #222' }}>
        <div style={{ color: '#666', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>{icon} {label}</div>
        <div style={{ fontSize: '1.6rem', fontWeight: '700', color: color }}>{val}</div>
    </div>
);

export default Dashboard;
