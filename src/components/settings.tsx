import React, { useContext } from 'react';
import UserContext from '../context/userContext';

/**
 * Private Route
 */

const Settings = () => {
    const {user, setUser} = useContext(UserContext);
    const userId = localStorage.getItem('userId') || '';

    console.log(user);
    return (

        <div>
            <h3>Categories</h3>
            <p>List all user's categories</p>
            

            <h3>Subreddits</h3>
            <p>List all user's subreddits along with it's category</p>
        </div>
    )
}

export default Settings;