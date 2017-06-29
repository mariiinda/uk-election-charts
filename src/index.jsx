import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as OfflinePluginRuntime from "offline-plugin/runtime";

import "./shared/index";
import App from "./containers/app/";
import configureStore from "./state/store/configure-store";

if (PRODUCTION) {
  // install offline plugin
  OfflinePluginRuntime.install();
}

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
