import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import manageInventory from "../../../apis/manageInventory";
import { AppDispatch } from "../../store";
import {
  KeyPairInterface,
  SuccessMessageInterface,
} from "../../../utils/redux_interfaces";
import flashMessage from "../../../utils/antd-message";

// Define the interface for the state
interface ManageInventoryState {
  page: number;
  perPage: number;
  sort: "asc" | "desc";
  sortColumn: string;
  searchText: string;
  totalRecords: number;
  totalPages: number;
  records: any[];
  type:string;
}

const initialState: ManageInventoryState  = {
  page: 1,
  perPage: 10,
  sort: "desc",
  sortColumn: "created_at",
  searchText: "",
  totalRecords: 0,
  totalPages: 1,
  records: [],
  type:""
};

const manageInventorySlice = createSlice({
  name: "manageInventory",
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
    setKitType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
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
  setKitType,
  setTotalRecords,
  setTotalPages,
  setRecords,
} = manageInventorySlice.actions;

const resetManageInventoryState = (dispatch: AppDispatch) => {
  dispatch(setPage(1));
  dispatch(setPerPage(10));
  dispatch(setSort("desc"));
  dispatch(setSortColumn("created_at"));
  dispatch(setSearchText(""));
  dispatch(setKitType(""));
  dispatch(setTotalRecords(0));
  dispatch(setTotalPages(1));
  dispatch(setRecords([]));
};

export const GetKitInfoSlice =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageInventory.GetKitInfoApi(data);
      if (response.success) {
        if ("data" in response && response.data) {
          dispatch(setRecords(response?.data?.records));
          dispatch(setTotalPages(response?.data?.total_pages));
          dispatch(setTotalRecords(response?.data?.total_records));
          dispatch(setKitType(response?.data?.status));
          dispatch(setSearchText(response?.data?.search_text));
          dispatch(setSortColumn(response?.data?.sort_column));
          dispatch(setSort(response?.data?.sort));
          dispatch(setPerPage(response?.data?.per_page));
          dispatch(setPage(response?.data?.page));
        } else {
            resetManageInventoryState(dispatch);
        }
        // flashMessage(response.message, response.success ? "success" : "error");

      } else {
        flashMessage(response.message, response.success ? "success" : "error");
        resetManageInventoryState(dispatch);
      }
    } catch (error) {
      console.error("Error fetching admin user list:", error);
      resetManageInventoryState(dispatch);
    }
  };

export const CreatedKitInfoSlice =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageInventory.CreateKitInfoApi(data);
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

export const UpdatedKitInfoSlice =
  (data: KeyPairInterface,user_id: string, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageInventory.UpdateKitInfoApi(data,user_id);
      if (response.success) {
        if ("data" in response && response.data) {
          flashMessage(
            response.message,
            response.success ? "success" : "error"
          );
        } else {
            resetManageInventoryState(dispatch);
        }
      }
    } catch (error) {
      flashMessage("Internal Server Error", "error");
    }
  };

export const DeleteKitInfoSlice =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await manageInventory.DeleteKitInfoApi(data);
      if (response.success) {
        if ("data" in response && response.data) {
          flashMessage(
            response.message,
            response.success ? "success" : "error"
          );
        } else {
            resetManageInventoryState(dispatch);
        }
      }
    } catch (error) {
      flashMessage("Internal Server Error", "error");
    }
  };

export default manageInventorySlice.reducer;
