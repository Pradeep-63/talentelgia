import {
  LOGIN,
  FORGET_PASSWORD,
  RESET_PASSWORD,
  UPDATE_USER_DETAILS,
  GET_USER_DETAILS,
} from "./ApiConstants";
import { API } from "./api";
import { StandardResponse } from "./api/requestBuilder";

export const LoginApi = (data: any): Promise<StandardResponse> => {
  return API.post(LOGIN, data);
};

export const ForgetPasswordApi = (data: any): Promise<StandardResponse> => {
  return API.post(FORGET_PASSWORD, data);
};

export const ResetPasswordApi = (data: any): Promise<StandardResponse> => {
  return API.patch(RESET_PASSWORD, data);
};

export const UpdateUserDetails = (data: any): Promise<StandardResponse> => {
  return API.patch(UPDATE_USER_DETAILS, data);
};

export const GetUserDetails = (data: any): Promise<StandardResponse> => {
  return API.get(GET_USER_DETAILS, data);
};

export default {
  LoginApi,
  ForgetPasswordApi,
  ResetPasswordApi,
  UpdateUserDetails,
  GetUserDetails,
};
