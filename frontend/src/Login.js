import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

const Login = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });
        try {
            const url = `https://freelance-api-xyz.onrender.com/${isLogin ? 'login' : 'register'}`;
            const res = await axios.post(url, formData);
            if (isLogin) {
                setToken(res.data.access_token);
            } else {
                setMsg({ text: "Account created! You can now sign in.", type: 'success' });
                setIsLogin(true);
            }
        } catch (err) {
            setMsg({ text: err.response?.data?.detail || "Authentication failed", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', 
            backgroundColor: '#0f0f0f', fontFamily: '"Inter", sans-serif' 
        }}>
            <div style={{ 
                backgroundColor: '#161616', padding: '40px', borderRadius: '24px', width: '100%', 
                maxWidth: '400px', border: '1px solid #222', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' 
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ 
                        display: 'inline-flex', padding: '12px', borderRadius: '12px', 
                        background: 'linear-gradient(135deg, #007bff22, #00c6ff22)', marginBottom: '15px' 
                    }}>
                        <ShieldCheck color="#007bff" size={32} />
                    </div>
                    <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
                        {isLogin ? 'Enter your details to access your console' : 'Create your administrative account'}
                    </p>
                </div>

                {msg.text && (
                    <div style={{ 
                        padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center',
                        backgroundColor: msg.type === 'success' ? '#28a74515' : '#dc354515',
                        color: msg.type === 'success' ? '#28a745' : '#dc3545',
                        border: `1px solid ${msg.type === 'success' ? '#28a74533' : '#dc354533'}`
                    }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase' }}>Username</label>
                        <input type="text" required style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0f0f0f', border: '1px solid #333', color: 'white', outline: 'none' }}
                            onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', color: '#888', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
                        <input type="password" required style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#0f0f0f', border: '1px solid #333', color: 'white', outline: 'none' }}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <button disabled={loading} style={{ 
                        width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', 
                        border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                    }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? <><LogIn size={18}/> Sign In</> : <><UserPlus size={18}/> Create Account</>)}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                    <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span style={{ color: '#007bff', fontWeight: '600' }}>{isLogin ? 'Sign Up' : 'Log In'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
