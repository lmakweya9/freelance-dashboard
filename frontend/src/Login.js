import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, LogIn, UserPlus } from 'lucide-react';

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
                setMsg({ text: "Success! Please sign in.", type: 'success' });
                setIsLogin(true);
            }
        } catch (err) {
            setMsg({ text: err.response?.data?.detail || "Error connecting to server", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '350px', border: '1px solid #333' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {isLogin ? <LogIn color="#007bff" size={32} /> : <UserPlus color="#007bff" size={32} />}
                    <h2 style={{ color: 'white', marginTop: '10px' }}>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
                </div>
                {msg.text && <p style={{ color: msg.type === 'success' ? '#28a745' : '#dc3545', textAlign: 'center' }}>{msg.text}</p>}
                <form onSubmit={handleAuth}>
                    <input type="text" placeholder="Username" required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', background: '#252525', color: 'white', border: '1px solid #333' }}
                        onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    <input type="password" placeholder="Password" required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', background: '#252525', color: 'white', border: '1px solid #333' }}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#007bff', width: '100%', marginTop: '15px', cursor: 'pointer' }}>
                    {isLogin ? "Need an account? Sign Up" : "Have an account? Sign In"}
                </button>
            </div>
        </div>
    );
};

export default Login;
