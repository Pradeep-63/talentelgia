import React, { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loader from "../components/Loader/Loader";
import Header from "../components/Navbar/navbar.component";
import Sidebar from "../components/Sidebar/sidebar.component";
import Footer from "../components/Footer/footer.component";
import { useAppDispatch } from "../redux/hooks";
import { GetUserDetailsApiCall, setLoader } from "../redux/action";
import { DASHBOARD_APP_URL, LOGIN_APP_URL } from "../utils/app_url";
import { useNavigate } from "react-router-dom";
import flashMessage from "../utils/antd-message";
import { deleteAllLocalStorageData } from "../utils/localStorage";

interface TemplateProps {
  children: ReactNode;
  rolePermission?: string[] | null;
}

const Template: React.FC<TemplateProps> = ({ children, rolePermission }) => {
  const loading = useSelector((state: RootState) => state.loader.loader);
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDetailsFetched, setUserDetailsFetched] = useState(false); // State to track fetch status
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFetchUserDetails = async () => {
    if (userDetailsFetched) return; // Prevent re-fetching if already fetched

    try {
      await dispatch(setLoader(true));
      await dispatch(
        GetUserDetailsApiCall({}, async (response: any) => {
          await dispatch(setLoader(false));
          if (response && response?.status_code === 401) {
            navigate(LOGIN_APP_URL);
            flashMessage(response.message, "error");
            deleteAllLocalStorageData();
            setUserDetailsFetched(true);
          } else {
            setUserDetailsFetched(true);
          }
        })
      );
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    handleFetchUserDetails();
    // eslint-disable-next-line
  }, []);

  if (user && rolePermission) {
    const userRole = user.role.name;

    // Check if the user's role is in the rolePermission array
    if (!rolePermission.includes(userRole)) {
      navigate(DASHBOARD_APP_URL);
    }
  }

  return (
    <div className={`template-container ${currentTheme}`}>
      {loading && <Loader />}
      <Header toggleSidebar={toggleSidebar} />
      <div className="content-wrapper">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
          <div className="content py-4 px-3 main-component">{children}</div>
        </main>
      </div>
      <Footer sidebarCollapsed={sidebarCollapsed} />
    </div>
  );
};

export default Template;
