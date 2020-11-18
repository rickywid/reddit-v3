import React from 'react';
import { Link } from 'react-router-dom';
import Routes from './routes';
import './App.scss';

function App() {
    return (
        <div className="App">
            <Link to={'/'}>Home</Link>
            <Link to={'/settings'}>Settings</Link>
            {Routes}
        </div>
    );
}

export default App;
