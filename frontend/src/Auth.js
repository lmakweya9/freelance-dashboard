import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

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
                setMsg({ text: "Account created! You can now sign in.", type: 'success' });
                setIsLogin(true);
            }
        } catch (err) {
            setMsg({ 
                text: err.response?.data?.detail || "Connection failed. Server might be waking up.", 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', padding: '20px' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid #333' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 10px 0' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style={{ color: '#888' }}>{isLogin ? 'Sign in to manage your projects' : 'Start tracking your freelance income'}</p>
                </div>

                {msg.text && (
                    <div style={{ 
                        padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem',
                        backgroundColor: msg.type === 'success' ? '#28a74522' : '#dc354522',
                        color: msg.type === 'success' ? '#28a745' : '#dc3545',
                        border: `1px solid ${msg.type === 'success' ? '#28a745' : '#dc3545'}`
                    }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#555' }} />
                        <input 
                            type="text" placeholder="Username" required
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ position: 'relative', marginBottom: '25px' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#555' }} />
                        <input 
                            type="password" placeholder="Password" required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        {loading ? <Loader2 className="animate-spin" /> : isLogin ? 'Sign In' : 'Join Now'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#888', marginTop: '20px', fontSize: '0.9rem' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"} 
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
