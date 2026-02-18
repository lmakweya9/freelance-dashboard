import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, Briefcase, AlertCircle } from 'lucide-react';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

    const theme = {
        bg: '#121212',
        card: '#1e1e1e',
        text: '#e0e0e0',
        accent: '#007bff',
        border: '#333333'
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post(`${API_URL}/token`, 
                new URLSearchParams({ username, password }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            setToken(res.data.access_token);
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div style={{ 
            backgroundColor: theme.bg, 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontFamily: 'sans-serif' 
        }}>
            <div style={{ 
                background: theme.card, 
                padding: '40px', 
                borderRadius: '24px', 
                border: `1px solid ${theme.border}`, 
                width: '100%', 
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: theme.accent, padding: '15px', borderRadius: '50%' }}>
                        <Briefcase color="white" size={32} />
                    </div>
                </div>
                
                <h2 style={{ color: 'white', marginBottom: '10px' }}>Welcome Back</h2>
                <p style={{ color: '#888', marginBottom: '30px' }}>Sign in to manage your freelance dashboard</p>

                {error && (
                    <div style={{ 
                        background: 'rgba(255, 77, 77, 0.1)', 
                        color: '#ff4d4d', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <User style={{ position: 'absolute', left: '15px', top: '12px', color: '#888' }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ 
                                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', 
                                border: `1px solid ${theme.border}`, background: '#252525', color: 'white' 
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock style={{ position: 'absolute', left: '15px', top: '12px', color: '#888' }} size={20} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px', 
                                border: `1px solid ${theme.border}`, background: '#252525', color: 'white' 
                            }}
                        />
                    </div>
                    <button type="submit" style={{ 
                        background: theme.accent, color: 'white', padding: '14px', borderRadius: '12px', 
                        border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' 
                    }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
