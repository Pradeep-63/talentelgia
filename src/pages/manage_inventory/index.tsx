import React, { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { GetKitInfoSlice, setLoader } from "../../redux/action";
import {  faTruck } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import KitList from "../../components/ManageInventory/KitList";

interface FetchKitDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  type: string;
  perPage:number
  
}
const ManageInventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { perPage, records } = useSelector(
    (state: RootState) => state.manageInventory
  );

  const fetchAllKitDetails = async ({
    currentPage,
    sort,
    sortColumn,
    searchText,
    type,
    perPage,
  }: FetchKitDetailsParams) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        GetKitInfoSlice({
          page: currentPage,
          per_page: perPage,
          sort,
          sort_column: sortColumn,
          search_text: searchText,
          type,
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
      fetchAllKitDetails({
        currentPage: 1,
        sort: "desc",
        sortColumn: "created_at",
        searchText: "",
        type: "",
        perPage:perPage
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
            <FontAwesomeIcon icon={faTruck} className="me-2" />
              Manage Inventory</h3>
            
          </div>
        </div>
      </div>
      <KitList fetchAllKitDetails={fetchAllKitDetails} />
    </div>
  );
};

export default ManageInventory;
