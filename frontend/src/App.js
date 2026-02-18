import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  // Check local storage so the UI doesn't disappear on refresh
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
