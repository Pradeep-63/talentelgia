import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Dashboard = () => {
  return (
    <>
      <div className="main">
        <div className="row">
          <div className="col-lg-12">
            <div
              className="main-head mb-4 py-4 px-3 rounded-3"
              style={{ backgroundColor: "var(--bs-body-bg)" }}
            >
              <h3 className="m-0">
                {" "}
                <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
                Dashboard
              </h3>
            </div>
          </div>
        </div>
        <div
          className="content px-3 py-4 rounded-3"
          style={{ backgroundColor: "var(--bs-body-bg)" }}
        >
          <div className="dash_col dashboard-filter mb-4">
            <h4 className="m-0">Coming Soon</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
