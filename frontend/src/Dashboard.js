import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, Briefcase, Moon, Sun, LogOut } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [darkMode, setDarkMode] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

    // Fetch data wrapped in useCallback to prevent infinite loops
    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const totalEarnings = clients.reduce((sum, client) => 
        sum + client.projects.reduce((pSum, proj) => pSum + (proj.budget || 0), 0), 0
    );

    return (
        <div style={{ 
            backgroundColor: darkMode ? '#121212' : '#f4f7f6', 
            color: darkMode ? '#e0e0e0' : '#333', 
            minHeight: '100vh', 
            transition: '0.3s' 
        }}>
            {/* Navigation Bar */}
            <nav style={{ 
                padding: '20px 40px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderBottom: darkMode ? '1px solid #333' : '1px solid #ddd',
                backgroundColor: darkMode ? '#1e1e1e' : '#fff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LayoutDashboard color="#007bff" />
                    <h2 style={{ margin: 0 }}>Freelance Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button onClick={() => setDarkMode(!darkMode)} style={iconBtnStyle}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={handleLogout} style={logoutBtnStyle}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>

            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Stats Section */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #007bff, #0056b3)', 
                    color: 'white', 
                    padding: '30px', 
                    borderRadius: '20px', 
                    marginBottom: '40px',
                    boxShadow: '0 10px 20px rgba(0,123,255,0.3)'
                }}>
                    <p style={{ margin: 0, opacity: 0.8 }}>Total Managed Revenue</p>
                    <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>R {totalEarnings.toLocaleString()}</h1>
                </div>

                {/* Forms Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchData} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchData} darkMode={darkMode} />
                </div>

                {/* Clients List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {clients.map(client => (
                        <div key={client.id} style={{ 
                            backgroundColor: darkMode ? '#1e1e1e' : '#fff', 
                            padding: '20px', 
                            borderRadius: '16px', 
                            border: darkMode ? '1px solid #333' : '1px solid #ddd' 
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0 }}><Users size={16} style={{ marginRight: '8px' }} />{client.name}</h4>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>{client.company_name}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>{client.email}</div>
                            
                            <hr style={{ border: darkMode ? '0.5px solid #333' : '0.5px solid #eee', margin: '15px 0' }} />
                            
                            {client.projects.length > 0 ? (
                                client.projects.map(proj => (
                                    <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span><Briefcase size={14} style={{ marginRight: '5px' }} /> {proj.title}</span>
                                        <span style={{ fontWeight: 'bold' }}>R {proj.budget}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>No projects assigned</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const iconBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer', color: 'inherit'
};

const logoutBtnStyle = {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px',
    backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: 'bold'
};

export default Dashboard;
