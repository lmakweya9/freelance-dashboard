import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
    LayoutDashboard, Moon, Sun, Trash2, 
    CheckCircle, Clock, XCircle, Search 
} from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [darkMode, setDarkMode] = useState(true);
    
    // VERIFY: This must match your Render URL exactly
    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    }, [API_URL]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleStatus = async (projectId) => {
        try {
            await axios.patch(`${API_URL}/projects/${projectId}/toggle`);
            fetchData(); // Refresh UI
        } catch (err) {
            console.error("Toggle Error:", err);
        }
    };

    const handleDeleteClient = async (id) => {
        if (window.confirm("Delete this client and all their projects?")) {
            try {
                await axios.delete(`${API_URL}/clients/${id}`);
                fetchData();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.company_name && c.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalEarnings = clients.reduce((sum, client) => 
        sum + client.projects.reduce((pSum, proj) => 
            proj.status !== 'Abandoned' ? pSum + (proj.budget || 0) : pSum, 0), 0
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Completed': return { bg: '#28a74533', text: '#28a745', icon: <CheckCircle size={14}/> };
            case 'Abandoned': return { bg: '#dc354533', text: '#dc3545', icon: <XCircle size={14}/> };
            default: return { bg: '#ffc10733', text: '#ffc107', icon: <Clock size={14}/> };
        }
    };

    return (
        <div style={{ 
            backgroundColor: darkMode ? '#121212' : '#f4f7f6', 
            color: darkMode ? '#e0e0e0' : '#333', 
            minHeight: '100vh',
            transition: '0.3s'
        }}>
            <nav style={{ 
                padding: '20px 40px', display: 'flex', justifyContent: 'space-between', 
                backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderBottom: '1px solid #333' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LayoutDashboard color="#007bff" />
                    <h2 style={{ margin: 0 }}>Freelance Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setToken(null)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
                </div>
            </nav>

            <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #0056b3, #004085)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                    <p style={{ margin: 0, opacity: 0.8 }}>Total Earnings (Active & Completed)</p>
                    <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>R {totalEarnings.toLocaleString()}</h1>
                </div>

                <div style={{ position: 'relative', marginBottom: '30px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        style={{ width: '100%', padding: '15px 50px', borderRadius: '12px', border: '1px solid #333', backgroundColor: darkMode ? '#1e1e1e' : '#fff', color: 'inherit', outline: 'none' }} 
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchData} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchData} darkMode={darkMode} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {filteredClients.map(client => (
                        <div key={client.id} style={{ backgroundColor: darkMode ? '#1e1e1e' : '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>{client.name}</h3>
                                <button onClick={() => handleDeleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}><Trash2 size={20} /></button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>{client.company_name || "Personal"}</p>
                            <hr style={{ border: '0.5px solid #333', margin: '16px 0' }} />
                            {client.projects.map(proj => {
                                const style = getStatusStyle(proj.status);
                                return (
                                    <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ opacity: proj.status === 'Abandoned' ? 0.5 : 1 }}>{proj.title}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <button 
                                                onClick={() => toggleStatus(proj.id)} 
                                                style={{ 
                                                    cursor: 'pointer', padding: '5px 12px', borderRadius: '20px', border: 'none', 
                                                    backgroundColor: style.bg, color: style.text, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' 
                                                }}
                                            >
                                                {style.icon} {proj.status === 'Active' ? 'In Progress' : proj.status}
                                            </button>
                                            <span style={{ fontWeight: 'bold' }}>R {proj.budget}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
