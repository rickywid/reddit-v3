import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import history from "./lib/history";
import UserProvider from "./components/providers/userProvider";
import './index.scss';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

console.log(process.env)
console.log('environment: ', process.env.NODE_ENV)

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <Router history={history}>
                <Provider store={store}>
                    <App />
                </Provider>
            </Router>
        </UserProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();