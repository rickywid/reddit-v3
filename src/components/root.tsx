import React, { useContext } from 'react';
import Landing from './landing';
import Dash from './dash';
import UserContext from '../context/userContext';

const Root = () => {
    // eslint-disable-next-line
    const {user, setUser} = useContext(UserContext);
    return (
        <div style={{height: '90vh', display: 'flex'}}>
            {!user ? <Landing /> : <Dash />}
        </div>
    )
}

export default Root;