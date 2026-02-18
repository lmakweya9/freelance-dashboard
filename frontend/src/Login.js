import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, LogIn, UserPlus } from 'lucide-react';

const Login = ({ setToken }) => {
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
                setToken(res.data.access_token);
            } else {
                setMsg({ text: "Account created! Please sign in.", type: 'success' });
                setIsLogin(true);
            }
        } catch (err) {
            const errorText = err.response?.data?.detail || "Connection failed. Server waking up?";
            setMsg({ text: errorText, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', padding: '20px' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '380px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ backgroundColor: '#007bff22', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px' }}>
                        {isLogin ? <LogIn color="#007bff" size={28} /> : <UserPlus color="#007bff" size={28} />}
                    </div>
                    <h2 style={{ color: 'white', fontSize: '1.8rem', margin: '0 0 10px 0' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h2>
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
                    <input 
                        type="text" placeholder="Username" required
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #333', background: '#252525', color: 'white', boxSizing: 'border-box', marginBottom: '15px' }}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #333', background: '#252525', color: 'white', boxSizing: 'border-box', marginBottom: '25px' }}
                    />

                    <button disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#888', marginTop: '25px', fontSize: '0.9rem' }}>
                    {isLogin ? "New here?" : "Have an account?"} 
                    <button 
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
