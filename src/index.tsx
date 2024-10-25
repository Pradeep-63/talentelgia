import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
// import { PersistGate } from 'redux-persist/integration/react';
// import store, { persistor } from "./redux/store";
import store from "./redux/store";

import { BrowserRouter as Router } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import AllRoutes from "./routes/AllRoutes";
import "antd/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/index.css";
import "./assets/css/custom.css";
import { ToastContainer } from "react-toastify";
import "jquery/dist/jquery.min.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={<Loader />} persistor={persistor}> */}
      <Suspense fallback={<Loader />}>
        <ToastContainer limit={1} autoClose={1500} />
        <Router>
          <AllRoutes />
        </Router>
      </Suspense>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
