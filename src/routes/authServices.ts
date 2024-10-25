import {
  deleteAllLocalStorageData,
  getLocalStorageData,
} from "../utils/localStorage";

// Function for checking if the user is logged in
export const isLoggedIn = (): boolean => {
  const tokenData = getLocalStorageData("token");

  if (tokenData) {
    return true;
  } else {
    deleteAllLocalStorageData();

    return false;
  }
};
