import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Create form data for FastAPI OAuth2 compatibility
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('http://127.0.0.1:8000/login', formData);
      
      // THIS IS THE KEY: update the state so the UI switches to Dashboard
      setToken(response.data.access_token);
    } catch (error) {
      alert("Login failed! Check your terminal for 404/401 errors.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-10 bg-gray-100 flex flex-col gap-4">
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="bg-blue-500 text-white p-2">Login</button>
    </form>
  );
};

export default Login;
