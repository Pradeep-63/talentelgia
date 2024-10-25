// File: src/redux/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loader";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";
import manageStaffReducer from "./slices/manage-staff";
import modalReducer from "./slices/modal";
import manageInventoryReducer from './slices/manage-inventory'

const rootReducer = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
  theme: themeReducer,
  manageStaff: manageStaffReducer,
  manageInventory:manageInventoryReducer,
  modal: modalReducer,
});

export default rootReducer;
