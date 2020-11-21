import React, { useEffect, useState } from "react";
import UserContext from '../../context/userContext';
import Fetch from '../../lib/fetch';

export interface IUser {
    id: number | null;
    picture: string;
    username: string;
    categories: {
        name: string;
        subreddits: string[];
    }[]
}

const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId') || '';

    useEffect(() => {
        
        const fetch = new Fetch();
        const request = async () => {
            try {
                // const user: IUser = await fetch.getUser(userId);
                const user: IUser = await fetch.getUser();
                console.log(user)
                setUser(user);
                setLoading(false);
            } catch (e) {
                console.log(e)
            }
        }
        request();
        // if (user || userId) { request() } else { setLoading(false)};

    }, []);

    if (loading) {
        return <div></div>;
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;