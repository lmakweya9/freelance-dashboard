import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, ArrowRight, Loader2, LogIn } from 'lucide-react';

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
            // Added a longer timeout for Render cold starts
            const res = await axios.post(`${API_URL}${endpoint}`, formData, { timeout: 40000 });
            
            if (isLogin) {
                setToken(res.data.access_token);
            } else {
                setMsg({ text: "Account created! Now Sign In.", type: 'success' });
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            let errorText = "Connection failed. Please try again.";
            
            if (err.code === 'ECONNABORTED') {
                errorText = "Server is taking too long to wake up. Please wait 10 seconds and retry.";
            } else if (err.response) {
                errorText = err.response.data.detail || "Invalid username or password.";
            }
            
            setMsg({ text: errorText, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#121212', padding: '20px' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #333' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ backgroundColor: '#007bff22', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px' }}>
                        <LogIn color="#007bff" size={24} />
                    </div>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', margin: '0 0 8px 0' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h2>
                    <p style={{ color: '#888', fontSize: '0.9rem' }}>{isLogin ? 'Enter your details to login' : 'Create a new account'}</p>
                </div>

                {msg.text && (
                    <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.8rem', backgroundColor: msg.type === 'success' ? '#28a74522' : '#dc354522', color: msg.type === 'success' ? '#28a745' : '#dc3545', border: `1px solid ${msg.type === 'success' ? '#28a745' : '#dc3545'}` }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleAuth}>
                    <input 
                        type="text" placeholder="Username" required 
                        style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white', boxSizing: 'border-box' }}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required 
                        style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white', boxSizing: 'border-box' }}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#888', marginTop: '20px', fontSize: '0.8rem' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"} 
                    <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}>
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
