import { createContext } from 'react';

const UserContext = createContext<any>({
    id: null,
    picture: '',
    username: '',
    categories: [
        {
            name: '',
            subreddits: []
        }
    ]
});

export default UserContext;