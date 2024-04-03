import { createContext, useContext, useEffect } from "react";
import { AuthToken } from "../models/Auth";
import * as jwt from "../utils/jwt";
import { useStorageState } from "../hooks/useStorageState";
import { CommonConstant } from "../types/constant";
import http from "../utils/http";
import { useNavigate } from "react-router-dom";
import { Role } from "../models/CamAIEnum";

const AuthContext = createContext<{
  signIn: (params: AuthToken) => void;
  signOut: () => void;
  isLoading: boolean;
} | null>(null);

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}
export const getAccessToken = (): string | null => {
  const ACCESS_TOKEN = localStorage.getItem(CommonConstant.USER_ACCESS_TOKEN);
  return ACCESS_TOKEN;
};

export const getRefreshToken = (): string | null => {
  const REFRESH_TOKEN = localStorage.getItem(CommonConstant.USER_REFRESH_TOKEN);
  return REFRESH_TOKEN;
};

export function getUserRole(): Role | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const role: Role = jwt.getRoleFromToken(accessToken);
    return role;
  }

  return null;
}

export function getUserId(): string | null {
  const accessToken: string | null = getAccessToken();

  if (accessToken) {
    const id: string = jwt.getIdFromToken(accessToken);
    return id;
  }

  return null;
}

export const checkRole = (acceptableRole: Role): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;

  if (userRole == acceptableRole) return true;
  else return false;
};

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isAccessTokenLoading], setAccessToken] = useStorageState(
    CommonConstant.USER_ACCESS_TOKEN
  );

  const [[isRefreshTokenLoading], setRefreshToken] =
    useStorageState(CommonConstant.USER_REFRESH_TOKEN);

  const navigate = useNavigate();

  useEffect(() => {
    http.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
          if (err?.response?.status == 401) {
            if (err?.response?.headers.auto != "True") {
              localStorage.clear();
              navigate("/");
            }
          }else{
            Promise.reject(err);
          }

      }
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async ({ accessToken, refreshToken }: AuthToken) => {
          // Perform sign-in logic here
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          navigate(0);
        },
        signOut: () => {
          localStorage.clear()
          navigate("/login");
        },
        isLoading: isAccessTokenLoading || isRefreshTokenLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
