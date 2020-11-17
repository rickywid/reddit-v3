import React from 'react';

const Landing = () => {
    return (
        <div>
            <h1>Personalized Reddit Experience</h1>
            <p>Organize your favourite subreddits for easy access.</p>
            <button onClick={() => window.open("http://localhost:5000/api/auth/google", "_self")}>Login with Google</button>
        </div>
    )    
}

export default Landing;