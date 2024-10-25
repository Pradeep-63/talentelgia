import React, { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { GetAdminUserListSlice, setLoader } from "../../redux/action";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import StaffList from "../../components/ManageStaff/StaffList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";

interface FetchStaffDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  status: string;
}
const ManageStaff: React.FC = () => {
  const dispatch = useAppDispatch();
  const { perPage, records } = useSelector(
    (state: RootState) => state.manageStaff
  );

  const fetchAllStaffDetails = async ({
    currentPage,
    sort,
    sortColumn,
    searchText,
    status,
  }: FetchStaffDetailsParams) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        GetAdminUserListSlice({
          page: currentPage,
          per_page: perPage,
          sort,
          sort_column: sortColumn,
          search_text: searchText,
          status,
        })
      );
    } catch (err) {
      console.error("Error getting user details:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    if (records && records.length === 0) {
      fetchAllStaffDetails({
        currentPage: 1,
        sort: "desc",
        sortColumn: "created_at",
        searchText: "",
        status: "all",
      }); // eslint-disable-next-line
    }
  }, []);

  return (
    <div className="main">
      <div className="row">
        <div className="col-lg-12">
          <div
            className="main-head mb-4 py-4 px-3 rounded-3"
            style={{ backgroundColor: "var(--bs-body-bg)" }}
          >
            <h3 className="m-0">
              {" "}
              <FontAwesomeIcon icon={faUserShield} className="me-2" />
              Manage Staff
            </h3>
          </div>
        </div>
      </div>
      <StaffList fetchAllStaffDetails={fetchAllStaffDetails} />
    </div>
  );
};

export default ManageStaff;
