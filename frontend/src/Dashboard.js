import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, LogOut, Briefcase, Users } from 'lucide-react';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'https://freelance-api-xyz.onrender.com';

    // 1. Fetch clients on load
    const fetchClients = async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) {
            console.error("Failed to fetch clients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // 2. Delete Client Function (The Fix)
    const deleteClient = async (id) => {
        if (window.confirm("Are you sure you want to delete this client and all their projects?")) {
            try {
                await axios.delete(`${API_URL}/clients/${id}`);
                // Update the UI immediately by filtering out the deleted client
                setClients(clients.filter(client => client.id !== id));
            } catch (err) {
                alert("Failed to delete client. Check console for errors.");
            }
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '20px' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Freelance Dashboard</h1>
                <button onClick={() => setToken(null)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            {loading ? <p>Loading clients...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {clients.map(client => (
                        <div key={client.id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>{client.name}</h3>
                                <button onClick={() => deleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                                    <Trash2 size={18} hover={{color: '#ff4444'}} />
                                </button>
                            </div>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>{client.company_name}</p>
                            <hr style={{ borderColor: '#333', margin: '15px 0' }} />
                            {/* Projects List Here */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
