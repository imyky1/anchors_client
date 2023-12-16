import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CookiesProvider } from "react-cookie";
import LinkedinState from "./Context/LinkedinState";
import { BrowserRouter } from "react-router-dom";
import UserState from "./Context/UserState";
import SiteControlsState from "./Context/SiteControlsState";

const rootElement = document.getElementById("root");

ReactDOM.hydrate(
  <CookiesProvider>
    <BrowserRouter>
    <SiteControlsState>
      <LinkedinState>
      <UserState>
        <App />
        </UserState>
      </LinkedinState>
      </SiteControlsState>
    </BrowserRouter>
  </CookiesProvider>,
  rootElement
);

// if (rootElement.hasChildNodes()) {
// ReactDOM.hydrate(
// <CookiesProvider>
// <App />
// </CookiesProvider>,
// rootElement
// );
// } else {
// ReactDOM.render(
// <CookiesProvider>
// <App />
// </CookiesProvider>,
// rootElement
// );
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
