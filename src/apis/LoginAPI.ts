import http from "../utils/http";

export type LoginParams = {
  username: string;
  password: string;
};

export type ChangePasswordParams = {
  accessToken: string;
  oldPassword: string;
  newPassword: string;
  newPasswordRetype: string;
};

export const LoginAPI = {
  login: async (params: LoginParams) => {
    const res = await http.post("/api/auth", params);
    return res?.data;
  },
  _changePassword: async ({ accessToken, ...params }: ChangePasswordParams) => {
    const res = await http.post("/api/auth/password", params, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res?.data;
  },
};
