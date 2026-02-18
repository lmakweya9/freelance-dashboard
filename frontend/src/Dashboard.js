import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, Briefcase, Moon, Sun, LogOut, Trash2 } from 'lucide-react';
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
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteClient = async (clientId) => {
        if (window.confirm("Delete this client and all their projects?")) {
            try {
                await axios.delete(`${API_URL}/clients/${clientId}`);
                fetchData(); // Automatic refresh
            } catch (err) {
                alert("Could not delete client.");
            }
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const totalEarnings = clients.reduce((sum, client) => 
        sum + client.projects.reduce((pSum, proj) => pSum + (proj.budget || 0), 0), 0
    );

    return (
        <div style={{ backgroundColor: darkMode ? '#121212' : '#f4f7f6', color: darkMode ? '#e0e0e0' : '#333', minHeight: '100vh' }}>
            <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderBottom: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LayoutDashboard color="#007bff" />
                    <h2 style={{ margin: 0 }}>Freelance Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #007bff, #0056b3)', color: 'white', padding: '30px', borderRadius: '20px', marginBottom: '40px' }}>
                    <p style={{ margin: 0, opacity: 0.8 }}>Total Revenue</p>
                    <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>R {totalEarnings.toLocaleString()}</h1>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchData} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchData} darkMode={darkMode} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {clients.map(client => (
                        <div key={client.id} style={{ backgroundColor: darkMode ? '#1e1e1e' : '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{client.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: '5px 0' }}>{client.company_name}</p>
                                </div>
                                <button onClick={() => handleDeleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: '5px' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <hr style={{ border: '0.5px solid #333', margin: '15px 0' }} />
                            {client.projects.map(proj => (
                                <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                    <span>{proj.title}</span>
                                    <span style={{ fontWeight: 'bold' }}>R {proj.budget}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
