import React, { useState, useEffect } from 'react';
import Login from './Login';      // Fixed: Pointing to src/Login.js
import Dashboard from './Dashboard'; // Fixed: Pointing to src/Dashboard.js

function App() {
  // Check local storage for existing token to prevent logout on refresh
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className="App">
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Dashboard setToken={setToken} />
      )}
    </div>
  );
}

export default App;
