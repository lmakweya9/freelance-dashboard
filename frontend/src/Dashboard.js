import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, LogOut, Plus, Briefcase } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [showClientForm, setShowClientForm] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null); // For the project modal
    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) { console.error("Fetch error"); }
    };

    useEffect(() => { fetchClients(); }, []);

    const deleteClient = async (id) => {
        if (window.confirm("Delete client?")) {
            await axios.delete(`${API_URL}/clients/${id}`);
            fetchClients();
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Freelance Hub</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setShowClientForm(true)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Plus size={18} /> Add Client
                    </button>
                    <button onClick={() => setToken(null)} style={{ background: '#333', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            {/* Modals / Forms */}
            {showClientForm && (
                <AddClientForm 
                    onClose={() => setShowClientForm(false)} 
                    onSuccess={() => { setShowClientForm(false); fetchClients(); }} 
                />
            )}
            
            {selectedClientId && (
                <AddProjectForm 
                    clientId={selectedClientId} 
                    onClose={() => setSelectedClientId(null)} 
                    onSuccess={() => { setSelectedClientId(null); fetchClients(); }} 
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {clients.map(client => (
                    <div key={client.id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{client.name}</h3>
                            <button onClick={() => deleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><Trash2 size={18}/></button>
                        </div>
                        <p style={{ color: '#888', fontSize: '0.85rem' }}>{client.company_name}</p>

                        <div style={{ margin: '15px 0' }}>
                            {client.projects?.map(p => (
                                <div key={p.id} style={{ background: '#252525', padding: '8px', borderRadius: '5px', marginBottom: '5px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{p.title}</span>
                                    <span style={{ color: '#28a745' }}>${p.budget}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setSelectedClientId(client.id)} style={{ width: '100%', background: '#333', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            <Briefcase size={16} /> Assign Project
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
