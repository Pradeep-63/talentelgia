import React from "react";
import { RouteConfig } from "./types";
import {
  LOGIN_APP_URL,
  DASHBOARD_APP_URL,
  FORGET_PASSWORD_APP_URL,
  MANAGE_PROFILE_APP_URL,
  MANAGE_STAFF_APP_URL,
  MANAGE_INVENTORY_APP_URL,
} from "../utils/app_url";

export const LOGIN_APP_COMPONENT = React.lazy(
  () => import("../pages/login_page")
);
export const DASHBOARD_APP_COMPONENT = React.lazy(
  () => import("../pages/dashboard_page")
);
export const FORGET_PASSWORD_APP_COMPONENT = React.lazy(
  () => import("../pages/forget_password_page")
);
export const MANAGE_PROFILE_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_profile")
);
export const MANAGE_STAFF_APP_COMPONENT = React.lazy(
  () => import("../pages/manage_staff")
);
export const MANAGE_INVENTORY_APP_COMPONENT = React.lazy(() => import('../pages/manage_inventory'))
export const publicRoutes: RouteConfig[] = [
  {
    path: LOGIN_APP_URL,
    component: LOGIN_APP_COMPONENT,
    exact: true,
  },
  {
    path: FORGET_PASSWORD_APP_URL,
    component: FORGET_PASSWORD_APP_COMPONENT,
    exact: true,
  },
];

export const privateRoutes: RouteConfig[] = [
  {
    path: DASHBOARD_APP_URL,
    component: DASHBOARD_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: MANAGE_PROFILE_APP_URL,
    component: MANAGE_PROFILE_APP_COMPONENT,
    exact: true,
    roles: ["super-admin", "admin", "user"],
  },
  {
    path: MANAGE_STAFF_APP_URL,
    component: MANAGE_STAFF_APP_COMPONENT,
    exact: true,
    roles: ["super-admin"],
  },
  {
    path: MANAGE_INVENTORY_APP_URL,
    component: MANAGE_INVENTORY_APP_COMPONENT,
    exact: true
  }
];
