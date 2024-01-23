import { jwtDecode } from "jwt-decode";

export type RoleDetail = {
  Id: number;
  Name: string;
};
export type UserDetail = {
  id: string;
  roles: string;
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
