import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from './authServices';
import { LOGIN_APP_URL, DASHBOARD_APP_URL } from '../utils/app_url';

export const LoginRouteHandler: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  if (!userLoggedIn) {
    return <Navigate to={LOGIN_APP_URL} replace />;
  } else {
    return <Navigate to={DASHBOARD_APP_URL} replace />;
  }
};

export const PrivateRouteHandler: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  return userLoggedIn ? <Outlet /> : <Navigate to={LOGIN_APP_URL} replace />;
};

export const PublicRouteHandler: React.FC = () => {
  const userLoggedIn = isLoggedIn();
  return !userLoggedIn ? <Outlet /> : <Navigate to={DASHBOARD_APP_URL} replace />;
};