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

    useEffect(() => {
        const fetch = new Fetch();
        const request = async () => {
            try {
                const user: IUser = await fetch.getUser();
                setUser(user);
                setLoading(false);
            } catch (e) {
                console.log(e)
                // window.location.replace(`${process.env.REACT_APP_CLIENT}`);
            }
        }
        request();

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