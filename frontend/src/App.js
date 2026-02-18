import React, { useState, useEffect } from 'react';
import Login from './Login'; // Ensure your file is named Login.js (containing the Auth code)
import Dashboard from './Dashboard';

function App() {
    // 1. Initialize token state from localStorage so users stay logged in after a refresh
    const [token, setToken] = useState(localStorage.getItem('token'));

    // 2. Function to handle logging out
    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear from browser storage
        setToken(null); // Update state to trigger redirect to Login screen
    };

    // 3. Conditional Rendering based on authentication status
    return (
        <div className="App">
            {!token ? (
                // If there is no token, show the Sign In / Login screen
                <Login setToken={(newToken) => {
                    localStorage.setItem('token', newToken); // Save token for persistence
                    setToken(newToken);
                }} />
            ) : (
                // If token exists, show the main application
                <Dashboard setToken={handleLogout} />
            )}
        </div>
    );
}

export default App;
