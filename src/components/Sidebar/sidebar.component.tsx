// src/components/Sidebar/Sidebar.tsx

import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";
import {
  DASHBOARD_APP_URL,
  MANAGE_PROFILE_APP_URL,
  MANAGE_STAFF_APP_URL,
  MANAGE_INVENTORY_APP_URL,
} from "../../utils/app_url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUserCog,
  faQuestionCircle,
  faUserShield,
  faTruck
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

// Define the SidebarItem interface
interface SidebarItem {
  path: string;
  name: string;
  icon: IconDefinition;
  roles: string[]; // Roles that can access this route
}

// Sidebar configuration array
const sidebarItems: SidebarItem[] = [
  {
    path: DASHBOARD_APP_URL,
    name: "Dashboard",
    icon: faTachometerAlt,
    roles: ["super-admin", "admin", "user"], // Example roles
  },
  {
    path: MANAGE_STAFF_APP_URL,
    name: "Manage Staff",
    icon: faUserShield,
    roles: ["super-admin"], // Example roles
  },
  // {
  //   path: MANAGE_PROFILE_APP_URL,
  //   name: "Manage Profile",
  //   icon: faUserCog,
  //   roles: ["super-admin", "admin", "user"], // Example roles
  // },
  {
    path: MANAGE_INVENTORY_APP_URL,
    name: "Manage Inventory",
    icon: faTruck,
    roles: ["super-admin", "admin"], // Example roles
  },
  
];

interface SidebarProps {
  collapsed: boolean;
}

// Utility function to check if the current user has access to a sidebar item
const hasAccess = (userRole: string, itemRoles: string[]): boolean => {
  return itemRoles.includes(userRole);
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const location = useLocation();

  // Function to add active class based on current route
  const addActiveClass = (currentRoute: string): boolean => {
    let currentActiveRoute = location.pathname;
    if (location.pathname.includes("/update")) {
      const path = location.pathname.split("/");
      path.pop();
      currentActiveRoute = path.join("/");
    }
    return currentRoute === currentActiveRoute;
  };
  return (
    <aside
      id="sidebar"
      className={`flex-column sidebar ${currentTheme} ${
        collapsed ? "collapsed" : ""
      }`}
    >
      <div className="sidebar-outer h-100">
        <ul className="sidebar-nav" data-bs-parent="#sidebar">
          {sidebarItems.map((item) => {
            if (hasAccess(user?.role?.name, item.roles)) {
              return (
                <li
                  key={item.path}
                  className={`sidebar-item ${
                    addActiveClass(item.path) ? "active" : ""
                  }`}
                >
                  <Link to={item.path} className="sidebar-link">
                    <span className="side-ico">
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                    {item.name}
                  </Link>
                </li>
              );
            }
            return null;
          })}
        </ul>
        <ul className="sidebar-nav sidebar-btm">
          <li className="sidebar-item">
            <Link to="/help" className="sidebar-link">
              <span className="side-ico">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
              Have a Question? Find it here
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
