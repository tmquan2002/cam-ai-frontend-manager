export interface Login {
  username: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface Password {
  oldPassword: string;
  newPassword: string;
  newPasswordRetype: string;
}
