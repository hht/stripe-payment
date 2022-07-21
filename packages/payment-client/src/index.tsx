import React from "react";
import ReactDOM from "react-dom/client";
import "styles/index.less";
import { Auth0Provider } from "@auth0/auth0-react";
import { App } from "App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Auth0Provider
    domain="dev-w3aq7ufb.us.auth0.com"
    clientId="2yXHCRq8ls3CyuTUPYuor13q3LwRV6gv"
    audience="https://localhost/subscription"
    redirectUri={window.location.href}
  >
    <App />
  </Auth0Provider>
);
