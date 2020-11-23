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
            <nav>
                <ul>
                    <li><Link to={'/'}>Home</Link></li>
                    {user && <div className="auth-links">
                        <li><Link to={'/settings'}>{user.username}</Link></li>
                        <li><button onClick={logout}>logout</button></li>
                    </div>}
                </ul>
            </nav>
            {Routes}
        </div>
    );
}

export default App;
