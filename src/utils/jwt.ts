import { jwtDecode } from "jwt-decode";

export type RoleDetail = {
  Id: number;
  Name: string;
};

export type StatusDetail = {
  Id: number;
  Name: string;
};

export type UserDetail = {
  id: string;
  roles: string;
  status: string;
  exp: number;
};

export const getPayloadFromToken = (token: string): UserDetail => {
  const user_detail: UserDetail = jwtDecode(token);
  return user_detail;
};

export const getRolesFromToken = (token: string): RoleDetail[] => {
  const roles: RoleDetail[] = JSON.parse(getPayloadFromToken(token).roles);
  return roles;
};

export const getIdFromToken = (token: string): string => {
  const id: string = getPayloadFromToken(token).id;
  return id;
};

export const getStatusFromToken = (token: string): StatusDetail => {
  const status: StatusDetail = JSON.parse(getPayloadFromToken(token).status);
  return status;
};
