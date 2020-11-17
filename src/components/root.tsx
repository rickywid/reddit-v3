import React, { useEffect, useContext } from 'react';
import Landing from './landing';
import Dash from './dash';
import UserContext from '../context/userContext';
import Fetch from '../lib/fetch';

interface IUser {
    id:number,
    picture:string,
    username:string,
    categories:{
        name: string,
        subreddits: string[]
    }[]
 }

const Root = () => {
    const {user, setUser} = useContext(UserContext);
    const userId = localStorage.getItem('userId') || '';

    useEffect(() => {
        
        const fetch = new Fetch();
        const request = async() => {
            try {
                const user:IUser = await fetch.getUser(userId);
                setUser(user);
            } catch(e) {
                console.log(e)
            }
        }

        if(user || userId) { request() };
        
    },[]);

    return (

        <div>
            {!user ? <Landing /> : <Dash />}
        </div>
    )
}

export default Root;