import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  KeyPairInterface,
  SuccessMessageInterface,
} from "../../../utils/redux_interfaces";
import { AppDispatch } from "../../store";
import authenticateApi from "../../../apis/authenticateApi";
import { setLocalStorageData } from "../../../utils/localStorage";
import flashMessage from "../../../utils/antd-message";

// Define the shape of the auth state
interface AuthState {
  user: any | null; // Replace 'any' with a more specific user type if available
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;

export const LoginUser =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authenticateApi.LoginApi(data);
      if (response.success) {
        if ("data" in response && response.data) {
          await setLocalStorageData("token", response.data.token);
        }
        dispatch({ type: "auth/loginSuccess" });
      }
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Login error:", error);
      flashMessage("An error occurred during login", "error");
    }
  };

export const ForgetPasswordApiCall =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authenticateApi.ForgetPasswordApi(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Forget Password error:", error);
      flashMessage("An error occurred during Forget password", "error");
    }
  };

export const ResetPasswordApiCall =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authenticateApi.ResetPasswordApi(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      flashMessage("An error occurred during Reset password", "error");
    }
  };

export const UpdateUserDetailsApiCall =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authenticateApi.UpdateUserDetails(data);
      flashMessage(response.message, response.success ? "success" : "error");
      if (response && response.success && "data" in response && response.data) {
        dispatch(setAuthUser(response.data));
      }
    } catch (error) {
      console.error("Update User Details error:", error);
      flashMessage("An error occurred during update user details", "error");
    }
  };

export const GetUserDetailsApiCall =
  (data: KeyPairInterface, callback?: (res: SuccessMessageInterface) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authenticateApi.GetUserDetails(data);
      if (response && response.success && "data" in response && response.data) {
        await dispatch(setAuthUser(response.data));
      }
      if (callback) {
        callback(response);
      }
    } catch (error) {
      console.error("Update User Details error:", error);
    }
  };
export default authSlice.reducer;
