import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, ShieldCheck } from 'lucide-react';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const res = await axios.post('http://127.0.0.1:8000/login', formData);
            localStorage.setItem('token', res.data.access_token);
            setToken(res.data.access_token);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f7f6' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <ShieldCheck size={50} color="#007bff" />
                    <h2>Freelance Hub</h2>
                    <p>Enter your credentials to continue</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    {error && <p style={{ color: 'red', fontSize: '0.8rem' }}>{error}</p>}
                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;