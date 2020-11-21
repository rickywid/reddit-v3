import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Routes from './routes';
import './App.scss';
import Fetch from './lib/fetch';
import UserContext from './context/userContext';

function App() {

    const { user, setUser } = useContext(UserContext)
    const logout = async () => {
        const fetch = new Fetch();
        localStorage.removeItem('userId');
        await fetch.logout('/auth/logout');
        setUser(null);
    }

    return (
        <div className="App">
            <p>{user.username}</p>
            <Link to={'/'}>Home</Link>
            <Link to={'/settings'}>Settings</Link>
            <button onClick={logout}>logout</button>
            {Routes}
        </div>
    );
}

export default App;
