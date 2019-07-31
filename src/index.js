import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./scss/App.scss";
import { Modal } from "react-bootstrap";

const App = lazy(() => import("./App"));

ReactDOM.render(
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
);