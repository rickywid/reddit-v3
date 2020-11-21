import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Routes from './routes';
import './App.scss';
import Fetch from './lib/fetch';
import history from './lib/history';
import UserContext from './context/userContext';

function App() {

    const { user, setUser } = useContext(UserContext)
    const logout = async () => {
        const fetch = new Fetch();
        localStorage.removeItem('userId');
        await fetch.logout('/auth/logout');
        history.push('/');
        setUser(null);
    }

    console.log(user);
    return (
        <div className="App">
            {user && <div>
                <p>{user.username}</p>
                <Link to={'/settings'}>Settings</Link>
                <button onClick={logout}>logout</button>
            </div>}
            <Link to={'/'}>Home</Link>
            {Routes}
        </div>
    );
}

export default App;
