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
    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data || []);
        } catch (err) { 
            console.error("Fetch Error:", err);
            setClients([]); // Prevent blank screen on error
        }
    }, [API_URL]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleStatus = async (projectId) => {
        try {
            await axios.patch(`${API_URL}/projects/${projectId}/toggle`);
            fetchData(); 
        } catch (err) { console.error("Toggle Error:", err); }
    };

    const handleDeleteClient = async (id) => {
        if (window.confirm("Delete client and all associated projects?")) {
            await axios.delete(`${API_URL}/clients/${id}`);
            fetchData();
        }
    };

    const filteredClients = clients.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalEarnings = clients.reduce((sum, client) => 
        sum + (client.projects?.reduce((pSum, proj) => 
            proj.status !== 'Abandoned' ? pSum + (proj.budget || 0) : pSum, 0) || 0), 0
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Completed': return { bg: '#28a74533', text: '#28a745', icon: <CheckCircle size={14}/> };
            case 'Abandoned': return { bg: '#dc354533', text: '#dc3545', icon: <XCircle size={14}/> };
            default: return { bg: '#ffc10733', text: '#ffc107', icon: <Clock size={14}/> };
        }
    };

    return (
        <div style={{ backgroundColor: darkMode ? '#121212' : '#f4f7f6', color: darkMode ? '#e0e0e0' : '#333', minHeight: '100vh' }}>
            <nav style={{ padding: '15px 5%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderBottom: '1px solid #333', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <LayoutDashboard color="#007bff" />
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Freelance Dashboard</h2>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setToken(null)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
                </div>
            </nav>

            <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', paddingTop: '30px' }}>
                <div style={{ background: 'linear-gradient(135deg, #0056b3, #004085)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                    <p style={{ margin: 0, opacity: 0.8 }}>Total Earnings</p>
                    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', margin: '10px 0' }}>R {totalEarnings.toLocaleString()}</h1>
                </div>

                <div style={{ position: 'relative', marginBottom: '30px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input type="text" placeholder="Search clients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px 45px', borderRadius: '10px', border: '1px solid #333', backgroundColor: darkMode ? '#1e1e1e' : '#fff', color: 'inherit', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <AddClientForm onClientAdded={fetchData} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchData} darkMode={darkMode} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '20px' }}>
                    {filteredClients.map(client => (
                        <div key={client.id} style={{ backgroundColor: darkMode ? '#1e1e1e' : '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h3>{client.name}</h3>
                                <button onClick={() => handleDeleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>{client.company_name}</span>
                            <hr style={{ border: '0.5px solid #333', margin: '15px 0' }} />
                            {client.projects?.map(proj => {
                                const style = getStatusStyle(proj.status);
                                return (
                                    <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '5px' }}>
                                        <span>{proj.title}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => toggleStatus(proj.id)} style={{ cursor: 'pointer', padding: '4px 10px', borderRadius: '20px', border: 'none', backgroundColor: style.bg, color: style.text, fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {style.icon} {proj.status}
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
