import React, { Component } from "react";
import ReactDOM from "react-dom";
import App from "./component/app.component";
ReactDOM.render(<App />, document.querySelector("#root"));


/*import React, { lazy, Suspense, Fragment } from "react";
import ReactDOM from "react-dom";

const App = lazy(() => import("./component/app.component"));
ReactDOM.render(
  <Suspense fallback={<p>loading....</p>}>
    <App />
  </Suspense>,
  document.querySelector("#root")
);*/