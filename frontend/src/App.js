import React, { useState } from 'react'; // Removed useEffect
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="App">
            {!token ? (
                <Login setToken={(newToken) => {
                    localStorage.setItem('token', newToken);
                    setToken(newToken);
                }} />
            ) : (
                <Dashboard setToken={handleLogout} />
            )}
        </div>
    );
}

export default App;
