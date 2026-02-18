import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, LogIn } from 'lucide-react'; // Removed User, Lock, ArrowRight

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = 'https://freelance-api-xyz.onrender.com';

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/login`, formData);
            setToken(res.data.access_token);
        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '16px', width: '350px', border: '1px solid #333' }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                    <LogIn size={40} color="#007bff" style={{ marginBottom: '10px' }} />
                    <h2 style={{ marginBottom: '20px' }}>Sign In</h2>
                </div>
                {error && <p style={{ color: '#ff4444', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleAuth}>
                    <input type="text" placeholder="Username" required style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: 'white' }}
                        onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    <input type="password" placeholder="Password" required style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', background: '#222', color: 'white' }}
                        onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
