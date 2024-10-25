import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import manageStaffApi from "../../../apis/manageStaffApi";
import { AppDispatch } from "../../store";
import {
  KeyPairInterface,
  SuccessMessageInterface,
} from "../../../utils/redux_interfaces";
import flashMessage from "../../../utils/antd-message";

// Define the interface for the state
interface ManageStaffState {
  page: number;
  perPage: number;
  sort: "asc" | "desc";
  sortColumn: string;
  searchText: string;
  status: string;
  totalRecords: number;
  totalPages: number;
  records: any[];
}

const initialState: ManageStaffState = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  status: "all",
  totalRecords: 0,
  totalPages: 1,
  records: [],
};

const manageStaffSlice = createSlice({
  name: "manageStaff",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
    },
    setSort: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sort = action.payload;
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      state.sortColumn = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setTotalRecords: (state, action: PayloadAction<number>) => {
      state.totalRecords = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setRecords: (state, action: PayloadAction<any[]>) => {
      state.records = action.payload;
    },
  },
});

export const {
  setPage,
  setPerPage,
  setSort,
  setSortColumn,
  setSearchText,
  setStatus,
  setTotalRecords,
  setTotalPages,
  setRecords,
} = manageStaffSlice.actions;

const resetManageStaffState = (dispatch: AppDispatch) => {
  dispatch(setPage(1));
  dispatch(setPerPage(10));
  dispatch(setSort("desc"));
  dispatch(setSortColumn("created_at"));
  dispatch(setSearchText(""));
  dispatch(setStatus("all"));
  dispatch(setTotalRecords(0));
  dispatch(setTotalPages(1));
  dispatch(setRecords([]));
};

export const GetAdminUserListSlice =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageStaffApi.GetAdminUserListApi(data);
      if (response.success) {
        if ("data" in response && response.data) {
          dispatch(setRecords(response?.data?.records));
          dispatch(setTotalPages(response?.data?.total_pages));
          dispatch(setTotalRecords(response?.data?.total_records));
          dispatch(setStatus(response?.data?.status));
          dispatch(setSearchText(response?.data?.search_text));
          dispatch(setSortColumn(response?.data?.sort_column));
          dispatch(setSort(response?.data?.sort));
          dispatch(setPerPage(response?.data?.per_page));
          dispatch(setPage(response?.data?.page));
        } else {
          resetManageStaffState(dispatch);
        }
        // flashMessage(response.message, response.success ? "success" : "error");

      } else {
        flashMessage(response.message, response.success ? "success" : "error");
        resetManageStaffState(dispatch);
      }
    } catch (error) {
      console.error("Error fetching admin user list:", error);
      resetManageStaffState(dispatch);
    }
  };

export const CreatedAdminUserSlice =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageStaffApi.CreateAdminUserApi(data);
      if (response.success) {
        if ("data" in response && response.data) {
          flashMessage(
            response.message,
            response.success ? "success" : "error"
          );
        }
      }
    } catch (error) {
      flashMessage("InternalServer Error", "error");
    }
  };

export const UpdateAdminUserSlice =
  (data: KeyPairInterface,user_id: string, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageStaffApi.UpdateAdminUserApi(data,user_id);
      if (response.success) {
        if ("data" in response && response.data) {
          flashMessage(
            response.message,
            response.success ? "success" : "error"
          );
        } else {
          resetManageStaffState(dispatch);
        }
      }
    } catch (error) {
      flashMessage("Internal Server Error", "error");
    }
  };

export const DeleteAdminUserSlice =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageStaffApi.DeleteAdminUserApi(data);
      if (response.success) {
        if ("data" in response && response.data) {
          flashMessage(
            response.message,
            response.success ? "success" : "error"
          );
        } else {
          resetManageStaffState(dispatch);
        }
      }
    } catch (error) {
      flashMessage("Internal Server Error", "error");
    }
  };

export default manageStaffSlice.reducer;