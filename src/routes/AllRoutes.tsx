import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import {
  LoginRouteHandler,
  PrivateRouteHandler,
  PublicRouteHandler,
} from "./RouteHandlers";
import Template from "./Template";
import {
  publicRoutes,
  privateRoutes,
  LOGIN_APP_COMPONENT,
  DASHBOARD_APP_COMPONENT,
} from "./routes";
import Empty from "../components/Empty/Empty";
import PublicTemplate from "./publicTemplate";
import { isLoggedIn } from "./authServices";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loader from "../components/Loader/Loader";

const AllRoutes: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  const currentTheme = useSelector((state: RootState) => state.theme.theme);

  // Function to toggle between light and dark theme
  const toggleTheme = async () => {
    document.documentElement.setAttribute("data-bs-theme", currentTheme);
  };

  useEffect(() => {
    toggleTheme();
    // eslint-disable-next-line
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<LoginRouteHandler />}>
          <Route
            path="/"
            element={
              !userLoggedIn ? (
                <PublicTemplate>
                  <LOGIN_APP_COMPONENT />
                </PublicTemplate>
              ) : (
                <Template>
                  <DASHBOARD_APP_COMPONENT />
                </Template>
              )
            }
          />
        </Route>

        <Route element={<PublicRouteHandler />}>
          <Route
            path="/"
            element={
              <PublicTemplate>
                <LOGIN_APP_COMPONENT />
              </PublicTemplate>
            }
          />
          {publicRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <PublicTemplate>
                  <route.component />
                </PublicTemplate>
              }
            />
          ))}
        </Route>

        <Route element={<PrivateRouteHandler />}>
          <Route
            path="/"
            element={
              <Template>
                <DASHBOARD_APP_COMPONENT />
              </Template>
            }
          />
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <Template rolePermission={route.roles}>
                  <route.component />
                </Template>
              }
            />
          ))}
        </Route>

        <Route path="*" element={<Empty />} />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
