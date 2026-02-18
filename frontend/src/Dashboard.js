import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LayoutDashboard, Moon, Sun, LogOut, Trash2, CheckCircle, Clock } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
    }, [API_URL]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleDeleteClient = async (clientId) => {
        try {
            await axios.delete(`${API_URL}/clients/${clientId}`);
            fetchData(); 
        } catch (err) { console.error("Delete Error:", err); }
    };

    const toggleStatus = async (projectId) => {
        try {
            await axios.patch(`${API_URL}/projects/${projectId}/toggle`);
            fetchData();
        } catch (err) { console.error("Status Update Error:", err); }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const totalEarnings = clients.reduce((sum, client) => 
        sum + client.projects.reduce((pSum, proj) => pSum + (proj.budget || 0), 0), 0
    );

    return (
        <div style={{ backgroundColor: darkMode ? '#121212' : '#f4f7f6', color: darkMode ? '#e0e0e0' : '#333', minHeight: '100vh', transition: '0.3s' }}>
            <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderBottom: darkMode ? '1px solid #333' : '1px solid #ddd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LayoutDashboard color="#007bff" />
                    <h2 style={{ margin: 0 }}>Freelance Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #28a745, #1e7e34)', color: 'white', padding: '30px', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 10px 20px rgba(40,167,69,0.2)' }}>
                    <p style={{ margin: 0, opacity: 0.8 }}>Total Managed Revenue</p>
                    <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>R {totalEarnings.toLocaleString()}</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchData} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchData} darkMode={darkMode} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {clients.map(client => (
                        <div key={client.id} style={{ backgroundColor: darkMode ? '#1e1e1e' : '#fff', padding: '20px', borderRadius: '16px', border: darkMode ? '1px solid #333' : '1px solid #ddd', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{client.name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#888', margin: '2px 0' }}>{client.company_name}</p>
                                </div>
                                <button onClick={() => handleDeleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '5px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <hr style={{ border: darkMode ? '0.5px solid #333' : '0.5px solid #eee', margin: '12px 0' }} />
                            {client.projects.length > 0 ? client.projects.map(proj => (
                                <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.85rem' }}>
                                    <span>{proj.title}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span 
                                            onClick={() => toggleStatus(proj.id)}
                                            style={{ 
                                                cursor: 'pointer',
                                                padding: '2px 8px', 
                                                borderRadius: '12px', 
                                                fontSize: '0.65rem', 
                                                fontWeight: 'bold',
                                                backgroundColor: proj.status === 'Completed' ? '#28a74533' : '#ffc10733',
                                                color: proj.status === 'Completed' ? '#28a745' : '#ffc107',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            {proj.status === 'Completed' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                                            {proj.status}
                                        </span>
                                        <span style={{ fontWeight: 'bold' }}>R {proj.budget}</span>
                                    </div>
                                </div>
                            )) : <p style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>No projects found</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
