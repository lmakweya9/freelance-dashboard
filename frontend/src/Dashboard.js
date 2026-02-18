import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Briefcase, Search, Sun, Moon, LogOut, BrainCircuit, TrendingUp } from 'lucide-react';
import AddClientForm from './AddClientForm';
import AddProjectForm from './AddProjectForm';

const Dashboard = ({ setToken }) => {
    const [clients, setClients] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [aiPrediction, setAiPrediction] = useState(null);
    const [loadingAi, setLoadingAi] = useState(false);

    // Dynamic API URL for Local vs Production
    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

    const theme = {
        bg: darkMode ? '#121212' : '#f8f9fa',
        card: darkMode ? '#1e1e1e' : '#ffffff',
        text: darkMode ? '#e0e0e0' : '#333333',
        border: darkMode ? '#333333' : '#e0e0e0',
        accent: '#007bff'
    };

    // Memoized fetch function to satisfy ESLint and prevent infinite loops
    const fetchClients = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/clients/`);
            setClients(res.data);
        } catch (err) {
            console.error("Error fetching clients. Check if backend is running at:", API_URL);
        }
    }, [API_URL]);

    // Effect runs once on mount and whenever fetchClients changes
    useEffect(() => { 
        fetchClients(); 
    }, [fetchClients]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const handleAiAnalyze = async (budget, complexity) => {
        setLoadingAi(true);
        try {
            const res = await axios.post(`${API_URL}/predict-revenue`, {
                budget: budget,
                complexity: complexity || 5,
                client_history: 4.5 
            });
            setAiPrediction(res.data.ai_estimate);
        } catch (err) {
            console.error("AI Service Error", err);
        } finally {
            setLoadingAi(false);
        }
    };

    const totalRevenue = clients.reduce((acc, client) => {
        return acc + client.projects.reduce((pAcc, p) => pAcc + (p.budget || 0), 0);
    }, 0);

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.company_name && c.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', padding: '40px 20px', transition: '0.3s' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h1 style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Briefcase color={theme.accent} /> Dashboard
                    </h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setDarkMode(!darkMode)} style={{ cursor: 'pointer', background: theme.card, color: theme.text, border: 'none', borderRadius: '8px', padding: '10px' }}>
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={handleLogout} style={{ cursor: 'pointer', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 15px', display: 'flex', gap: '5px' }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </header>

                {/* AI INSIGHT BANNER */}
                {aiPrediction && (
                    <div style={{ background: '#28a745', color: 'white', padding: '20px', borderRadius: '16px', marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <TrendingUp size={30} />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>AI Predicted Settlement Value</p>
                                <h2 style={{ margin: 0 }}>R {aiPrediction.toLocaleString()}</h2>
                            </div>
                        </div>
                        <button onClick={() => setAiPrediction(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ background: theme.accent, color: 'white', padding: '20px', borderRadius: '16px' }}>
                        <p style={{ margin: 0, opacity: 0.8 }}>Total Earnings</p>
                        <h2 style={{ margin: 0 }}>R {totalRevenue.toLocaleString()}</h2>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '15px', top: '15px', color: '#888' }} />
                        <input 
                            type="text" 
                            placeholder="Search your clients..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '15px 15px 15px 50px', borderRadius: '16px', border: `1px solid ${theme.border}`, background: theme.card, color: theme.text }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <AddClientForm onClientAdded={fetchClients} darkMode={darkMode} />
                    <AddProjectForm clients={clients} onProjectAdded={fetchClients} darkMode={darkMode} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filteredClients.map(c => (
                        <div key={c.id} style={{ background: theme.card, padding: '20px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                            <h3 style={{ margin: 0 }}>{c.name}</h3>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{c.company_name}</p>
                            <div style={{ marginTop: '10px' }}>
                                {c.projects.map(p => (
                                    <div key={p.id} style={{ borderTop: `1px solid ${theme.border}`, padding: '12px 0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span>{p.title}</span>
                                            <strong>R {p.budget}</strong>
                                        </div>
                                        <button 
                                            onClick={() => handleAiAnalyze(p.budget, p.complexity)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: `1px solid ${theme.accent}`, color: theme.accent, padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                        >
                                            <BrainCircuit size={14} /> {loadingAi ? "Analyzing..." : "AI Risk Check"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
