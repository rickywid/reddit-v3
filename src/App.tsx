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
        await fetch.logout('/auth/logout');
        history.push('/');
        setUser(null);
    }

    return (
        <div className="App">
            <nav>
                <ul>
                    {user && <div className="auth-links">
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to={'/settings'}>{user.username || user.display_name}</Link></li>
                        <li><button className="signout" onClick={logout}>logout</button></li>
                    </div>}
                </ul>
            </nav>
            {Routes}
        </div>
    );
}

export default App;
