import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./scss/App.scss";
//import { Modal } from "react-bootstrap";
import App from "./App";

//const App = lazy(() => import("./App"));

/*ReactDOM.render(
    <Suspense fallback={
        <Modal size="sm" aria-labelledby="contained-modal-title-vcenter" centered show onHide={() => {}}>
            <Modal.Body>
                <h4>Загрузка...</h4>
            </Modal.Body>
        </Modal>
    }>
        <App />
    </Suspense>,
    document.querySelector("#app")
);*/

ReactDOM.render(
    <Router>
        <Route path="/" component={App} />
    </Router>,
    document.querySelector("#app")
);