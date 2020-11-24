import React from 'react';
import { ReactComponent as Github } from '../assets/github.svg';
import { ReactComponent as Facebook } from '../assets/facebook.svg';
import { ReactComponent as Twitter } from '../assets/twitter.svg';
import { ReactComponent as Google } from '../assets/google.svg';

const Landing = () => {
    return (
        <div style={{margin: 'auto'}}>
            <h1>Personalized Reddit</h1>
            <p>A quick and easy way to keep up to date with the subreddits that's important to you.</p>
            <div className="login-btn-group">
                <button className="btn-google" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/google`, "_self")}><Google />Log In with Google</button>
                <button className="btn-facebook" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/facebook`, "_self")}><Facebook />Log In with Facebook</button>
                <button className="btn-twitter" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/twitter`, "_self")}><Twitter />Log In with Twitter</button>
                <button className="btn-github" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/github`, "_self")}><Github />Log In with Github</button>
            </div>
            <small style={{marginTop: '10px', display: 'inline-block'}}><i>*if you have trouble signing in, disable any ad blockers.</i></small>
        </div>
    )
}

export default Landing;