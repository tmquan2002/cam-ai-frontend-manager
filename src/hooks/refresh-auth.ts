import { getAccessToken, getRefreshToken } from "../context/AuthContext";
import { CommonConstant } from "../types/constant";
import { LoginAPI } from "../apis/LoginAPI";

export const refreshAuth = async (failedRequest: any) => {
  const newToken = await LoginAPI.refresh({
    accessToken: getAccessToken() ?? "",
    refreshToken: getRefreshToken() ?? "",
  });

  if (newToken) {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    localStorage.setItem(CommonConstant.USER_ACCESS_TOKEN, newToken);
    return Promise.resolve(newToken);
  } else {
    // console.log("clear tokens refresh-auth");
    localStorage.clear();
    location.reload();

    return Promise.reject();
  }
};
