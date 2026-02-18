import React, { useState, useEffect } from 'react';
import Login from './Login';      // Fixed: matches your src folder
import Dashboard from './Dashboard'; // Fixed: matches your src folder

function App() {
  // Persistence logic for JWT stateless authentication [cite: 49]
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
