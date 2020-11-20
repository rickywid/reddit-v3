import React, { useContext } from 'react';
import Landing from './landing';
import Dash from './dash';
import UserContext from '../context/userContext';

const Root = () => {
    const {user, setUser} = useContext(UserContext);
    return (
        <div>
            {!user.id ? <Landing /> : <Dash />}
        </div>
    )
}

export default Root;