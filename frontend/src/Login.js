import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, Loader2, LogIn } from 'lucide-react';

const Auth = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });

        const endpoint = isLogin ? '/login' : '/register';
        
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, formData);
            
            if (isLogin) {
                localStorage.setItem('token', res.data.access_token);
                setToken(res.data.access_token);
            } else {
                setMsg({ text: "Account created! Please sign in.", type: 'success' });
                setIsLogin(true);
            }
        } catch (err) {
            // Handling the "Not Found" or "Cold Start" issue
            const errorMsg = err.response?.status === 404 
                ? "Server is waking up. Please wait 30 seconds and try again." 
                : (err.response?.data?.detail || "Connection failed.");
            setMsg({ text: errorMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', 
            minHeight: '100vh', backgroundColor: '#121212', padding: '20px' 
        }}>
            <div style={{ 
                backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '24px', 
                width: '100%', maxWidth: '400px', border: '1px solid #333',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ 
                        backgroundColor: '#007bff22', width: '60px', height: '60px', 
                        borderRadius: '50%', display: 'flex', justifyContent: 'center', 
                        alignItems: 'center', margin: '0 auto 15px' 
                    }}>
                        <LogIn color="#007bff" size={28} />
                    </div>
                    {/* CHANGED TEXT HERE */}
                    <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 10px 0' }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>
                        {isLogin ? 'Login to manage your freelance dashboard' : 'Join to start tracking your projects'}
                    </p>
                </div>

                {msg.text && (
                    <div style={{ 
                        padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem',
                        backgroundColor: msg.type === 'success' ? '#28a74522' : '#dc354522',
                        color: msg.type === 'success' ? '#28a745' : '#dc3545',
                        border: `1px solid ${msg.type === 'success' ? '#28a745' : '#dc3545'}`
                    }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#555' }} />
                        <input 
                            type="text" placeholder="Username" required
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            style={{ 
                                width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', 
                                border: '1px solid #333', background: '#252525', color: 'white', 
                                boxSizing: 'border-box', outline: 'none' 
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative', marginBottom: '25px' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#555' }} />
                        <input 
                            type="password" placeholder="Password" required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={{ 
                                width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', 
                                border: '1px solid #333', background: '#252525', color: 'white', 
                                boxSizing: 'border-box', outline: 'none' 
                            }}
                        />
                    </div>

                    <button disabled={loading} style={{ 
                        width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', 
                        border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                        transition: '0.3s'
                    }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Sign Up')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#888', marginTop: '25px', fontSize: '0.9rem' }}>
                    {isLogin ? "New here?" : "Already have an account?"} 
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ 
                            background: 'none', border: 'none', color: '#007bff', 
                            cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' 
                        }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
