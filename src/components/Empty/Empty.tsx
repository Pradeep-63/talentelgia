import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../../routes/authServices";
import {
  DASHBOARD_APP_URL,
  LOGIN_APP_URL,
  MANAGE_PROFILE_APP_URL,
  FORGET_PASSWORD_APP_URL,
} from "../../utils/app_url";

const Empty: React.FC = () => {
  const location = useLocation();
  const userLoggedIn = isLoggedIn();
  const matches = [LOGIN_APP_URL, DASHBOARD_APP_URL, FORGET_PASSWORD_APP_URL, MANAGE_PROFILE_APP_URL];

  if (matches.includes(location.pathname)) {
    return null;
  }

  return userLoggedIn ? (
    <Navigate to={DASHBOARD_APP_URL} />
  ) : (
    <Navigate to={LOGIN_APP_URL} />
  );
};

export default Empty;
