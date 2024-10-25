import { ADMIN_USER_API } from "./ApiConstants";
import { API } from "./api";
import { ReturnError, ReturnSuccess } from "./api/requestBuilder";

export const GetAdminUserListApi = (data: any) => {
  return API.get(ADMIN_USER_API, data);
};

export const CreateAdminUserApi = (data: any) => {
  return API.post(ADMIN_USER_API, data);
};

export const UpdateAdminUserApi = (data: any, user_id: string) => {
  return API.put(`${ADMIN_USER_API}/${user_id}`, data);
};

export const DeleteAdminUserApi = (data: any) => {
  return API.delete(`${ADMIN_USER_API}/${data.user_id}`, {});
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  GetAdminUserListApi,
  CreateAdminUserApi,
  UpdateAdminUserApi,
  DeleteAdminUserApi,
};
