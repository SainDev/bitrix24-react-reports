import React from "react";
import ReactDOM from "react-dom";
import "./scss/App.scss";
import auth from "./components/Auth";
import App from "./components/App";
import Login from "./components/Login";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    auth.isAuthenticated() ?
        <App />
    :
        <Login />
    ,
    document.querySelector("#app")
);

registerServiceWorker();