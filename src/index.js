import React from "react";
import ReactDOM from "react-dom";
import "./scss/App.scss";
import auth from "./utils/Auth";
import App from "./components/App";
import Login from "./components/Login";
import registerServiceWorker from './registerServiceWorker';
/** Google Analitycs **/
import ReactGA from 'react-ga';
if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-22097078-6');
    ReactGA.pageview(window.location.pathname + window.location.search);
}
/**********************/

ReactDOM.render(
    auth.isAuthenticated() ?
        <App />
    :
        <Login />
    ,
    document.querySelector("#app")
);

registerServiceWorker();