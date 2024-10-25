import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import logo_light from "../../assets/images/logo_new.jpeg";
import logo_dark from "../../assets/images/logo_new-dark.png";
import { Link, useNavigate } from "react-router-dom";
import flashMessage from "../../utils/antd-message";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { deleteAllLocalStorageData } from "../../utils/localStorage";
import { LOGIN_APP_URL, MANAGE_PROFILE_APP_URL } from "../../utils/app_url";
import humburgerIcon from "../../assets/images/hamburger.svg";
import moonImage from "../../assets/images/moon.svg";
import sunImage from "../../assets/images/sun.svg";
import { setAuthUser, setTheme } from "../../redux/action";
import { useAppDispatch } from "../../redux/hooks";
import { theme } from "../../helpers/common.enums";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const toggleTheme = async () => {
    const newTheme: theme = currentTheme === "dark" ? "light" : "dark";
    await dispatch(setTheme(newTheme));
    document.documentElement.setAttribute("data-bs-theme", newTheme);
  };

  const handleLogout = async () => {
    await deleteAllLocalStorageData();
    navigate(LOGIN_APP_URL);
    await dispatch(setAuthUser(null));
    flashMessage("Logout Successful", "success");
  };

  const handleProfile = () => {
    navigate(MANAGE_PROFILE_APP_URL);
  };

  return (
    <>
      <nav className="navbar navbar-expand px-3 py-1 border-bottom fixed-top header">
        <Link to="#" className="logo-brand">
          <img
            src={currentTheme === "light" ? logo_light : logo_dark}
            alt="logo"
          />
        </Link>
        <button
          className="btn"
          id="sidebar-toggle"
          type="button"
          onClick={toggleSidebar}
        >
          <img src={humburgerIcon} alt="humburger_icon" />
        </button>
        <div className="navbar-collapse navbar">
          <ul className="navbar-nav ms-auto">
            <li>
              <Link
                to="#"
                className="theme-toggle nav-link"
                onClick={toggleTheme}
              >
                <span className="moon">
                  <img src={currentTheme === "light" ? moonImage : sunImage} alt="moon" width={20} />
                </span>
              </Link>
            </li>
            <li className="dropdown">
              <Link
                to="#"
                className="btn btn-secondary dropdown-toggle px-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="profile-icn">
                  {user?.first_name
                    ? user?.first_name[0].toUpperCase()
                    : user?.email[0].toUpperCase()}
                </span>
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item border-bottom mb-2 pb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    {user?.email}
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleProfile}>
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;