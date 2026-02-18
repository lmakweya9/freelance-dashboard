import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, LogOut, PlusCircle, CheckCircle } from 'lucide-react';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeClientId, setActiveClientId] = useState(null);
    const [projData, setProjData] = useState({ title: '', budget: '' });

    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const fetchClients = async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) { console.error("Error fetching data"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchClients(); }, []);

    const deleteClient = async (id) => {
        if (window.confirm("Delete this client?")) {
            await axios.delete(`${API_URL}/clients/${id}`);
            setClients(prev => prev.filter(c => c.id !== id));
        }
    };

    const addProject = async (clientId) => {
        if (!projData.title) return alert("Enter a title");
        try {
            await axios.post(`${API_URL}/projects/`, {
                title: projData.title,
                budget: parseFloat(projData.budget || 0),
                client_id: clientId
            });
            setProjData({ title: '', budget: '' });
            setActiveClientId(null);
            fetchClients(); // Refresh list to see new project
        } catch (err) { alert("Error adding project"); }
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                <h1 style={{ margin: 0 }}>Freelance Dashboard</h1>
                <button onClick={() => setToken(null)} style={{ background: 'none', border: '1px solid #ff4444', color: '#ff4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>
                    <LogOut size={18} />
                </button>
            </nav>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {clients.map(client => (
                        <div key={client.id} style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3 style={{ color: '#007bff', margin: 0 }}>{client.name}</h3>
                                <button onClick={() => deleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>{client.company_name}</p>

                            <div style={{ marginTop: '15px' }}>
                                {client.projects?.map(p => (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#252525', padding: '8px', borderRadius: '8px', marginBottom: '5px', fontSize: '0.85rem' }}>
                                        <span>{p.title}</span>
                                        <span style={{ color: '#28a745' }}>${p.budget}</span>
                                    </div>
                                ))}
                            </div>

                            {activeClientId === client.id ? (
                                <div style={{ marginTop: '15px', background: '#121212', padding: '10px', borderRadius: '10px' }}>
                                    <input placeholder="Project Name" value={projData.title} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', background: '#222', border: '1px solid #444', color: 'white' }} 
                                        onChange={e => setProjData({...projData, title: e.target.value})} />
                                    <input type="number" placeholder="Budget" value={projData.budget} style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', background: '#222', border: '1px solid #444', color: 'white' }} 
                                        onChange={e => setProjData({...projData, budget: e.target.value})} />
                                    <button onClick={() => addProject(client.id)} style={{ width: '100%', padding: '8px', backgroundColor: '#28a745', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <CheckCircle size={16} /> Save
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => setActiveClientId(client.id)} style={{ marginTop: '15px', width: '100%', background: 'none', border: '1px dashed #444', color: '#888', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <PlusCircle size={16} /> Assign Project
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
