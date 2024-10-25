import { KIT_INFO_API } from "./ApiConstants";
import { API } from "./api";
import { ReturnError, ReturnSuccess } from "./api/requestBuilder";

export const GetKitInfoApi = (data: any) => {
    return API.get(KIT_INFO_API, data);
  };
  
export const CreateKitInfoApi = (data: any) => {
  return API.post(KIT_INFO_API, data);
};

export const UpdateKitInfoApi = (data: any, user_id: string) => {
  return API.patch(`${KIT_INFO_API}/${user_id}`, data);
};
export const DeleteKitInfoApi = (data: any) => {
    return API.delete(`${KIT_INFO_API}/${data.user_id}`, {});
  };
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    GetKitInfoApi,
    CreateKitInfoApi,
    UpdateKitInfoApi,
    DeleteKitInfoApi
};
