import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, Briefcase, AlertCircle } from 'lucide-react';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Points to your Render backend based on your FastAPI docs
    const API_URL = process.env.REACT_APP_API_URL || 'https://freelance-api-xyz.onrender.com';

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
            // Your FastAPI docs show the endpoint is /login, not /token
            // It requires application/x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await axios.post(`${API_URL}/login`, formData, {
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json'
                }
            });

            // FastAPI returns the token in res.data.access_token
            const token = res.data.access_token;
            if (token) {
                setToken(token);
                localStorage.setItem('token', token);
            }
        } catch (err) {
            // Handles the 400 error seen in your screenshot
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Connection failed. Check if backend is awake.");
            }
        }
    };

    return (
        <div style={{ 
            backgroundColor: theme.bg, 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontFamily: 'sans-serif',
            padding: '20px' 
        }}>
            <div style={{ 
                background: theme.card, 
                padding: '40px', 
                borderRadius: '24px', 
                border: `1px solid ${theme.border}`, 
                width: '100%', 
                maxWidth: '400px',
                textAlign: 'center',
                boxSizing: 'border-box'
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
                        fontSize: '0.9rem',
                        textAlign: 'left'
                    }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                        <User 
                            style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} 
                            size={18} 
                        />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ 
                                width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', 
                                border: `1px solid ${theme.border}`, background: '#252525', color: 'white',
                                fontSize: '16px', boxSizing: 'border-box', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative', width: '100%' }}>
                        <Lock 
                            style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} 
                            size={18} 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', 
                                border: `1px solid ${theme.border}`, background: '#252525', color: 'white',
                                fontSize: '16px', boxSizing: 'border-box', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <button type="submit" style={{ 
                        background: theme.accent, color: 'white', padding: '14px', borderRadius: '12px', 
                        border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px'
                    }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
