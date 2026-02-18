import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('https://freelance-api-xyz.onrender.com/login', {
                username,
                password
            });
            localStorage.setItem('token', res.data.access_token);
            setToken(res.data.access_token);
        } catch (err) {
            setError(err.response?.status === 404 ? "Server path not found" : "Invalid Credentials");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '12px', width: '350px', textAlign: 'center' }}>
                <h2 style={{ color: 'white' }}>Welcome Back</h2>
                {error && <p style={{ color: '#dc3545', backgroundColor: '#dc354522', padding: '10px', borderRadius: '8px' }}>{error}</p>}
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white' }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #333', background: '#252525', color: 'white' }} />
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</button>
            </form>
        </div>
    );
};

export default Login;
