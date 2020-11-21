import React, { useEffect } from 'react';
import { History, Location } from 'history';

interface Props {
    location: Location;
    history: History;
}

const Redirect = ({location, history}:Props) => {
    
    useEffect(() => {
        const queryStr = location.search;
        const urlParams = new URLSearchParams(queryStr.slice(1));
        const userId:string = urlParams.get('id') || '';
        localStorage.setItem('userId', userId);
        
        window.location.replace('http://localhost:3000')
    });

    return (
        <div>Redirecting...</div>
    )
}

export default Redirect;