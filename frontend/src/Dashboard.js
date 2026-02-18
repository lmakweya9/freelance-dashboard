import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, LogOut } from 'lucide-react'; // Cleaned unused icons

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'https://freelance-api-xyz.onrender.com';

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

    const deleteClient = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await axios.delete(`${API_URL}/clients/${id}`);
                // This line updates the screen immediately after deletion
                setClients(prevClients => prevClients.filter(client => client.id !== id));
            } catch (err) {
                alert("Failed to delete client.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Freelance Dashboard</h1>
                <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}>
                    <LogOut size={18} /> Logout
                </button>
            </nav>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>Loading your clients...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {clients.length === 0 ? (
                        <p style={{ color: '#888' }}>No clients found. Add one to get started!</p>
                    ) : (
                        clients.map(client => (
                            <div key={client.id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '15px', border: '1px solid #333', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{client.name}</h3>
                                        <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{client.company_name}</p>
                                        <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '0.8rem' }}>{client.email}</p>
                                    </div>
                                    <button 
                                        onClick={() => deleteClient(client.id)} 
                                        style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: '5px', transition: '0.3s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff4444'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#444'}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
