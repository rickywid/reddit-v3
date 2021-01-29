import React from 'react';
import { ReactComponent as Github } from '../assets/github.svg';
import { ReactComponent as Facebook } from '../assets/facebook.svg';
import { ReactComponent as Twitter } from '../assets/twitter.svg';
import { ReactComponent as Google } from '../assets/google.svg';
// import { domain } from '../lib/const';

const Landing = () => {
    return (
        <div style={{ margin: 'auto' }}>
            <h1>Personalized Reddit</h1>
            <p>A quick and easy way to keep up to date with the subreddits that's important to you.</p>
            <div className="login-btn-group">
                <button className="btn-google" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/google`, "_self")}><Google />Log In with Google</button>
                <button className="btn-facebook" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/facebook`, "_self")} disabled><Facebook />Facebook (coming soon)</button>
                <button className="btn-twitter" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/twitter`, "_self")}><Twitter />Log In with Twitter</button>
                <button className="btn-github" onClick={() => window.open(`${process.env.REACT_APP_SERVER}/api/auth/github`, "_self")}><Github />Log In with Github</button>
            </div>
            <small style={{ marginTop: '50px', marginBottom:'10px', display: 'inline-block' }}><i>*Trouble signing in? Try the following:</i></small>
            <ul className="login-help">
                <li>
                    <small style={{ display: 'block ' }}><i>- If using Chrome browser, you may have to <a style={{ color: 'blue' }} href="https://support.siteimprove.com/hc/en-gb/articles/360007364778-Turning-off-Google-Chrome-SameSite-Cookie-Enforcement">disable default Cookie settings</a>.</i></small>
                </li>
                <li>
                    <small style={{ display: 'block ' }}><i>- Try another browser such as Firefox, Brave, Internet Explorer.</i></small>
                </li>
            </ul>
        </div>
    )
}

export default Landing;