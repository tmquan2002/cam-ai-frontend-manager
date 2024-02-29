import { jwtDecode } from "jwt-decode";
import { AccountStatus, Role } from "../models/CamAIEnum";

export type StatusDetail = {
  Id: number;
  Name: string;
};

export type UserDetail = {
  id: string;
  role: Role;
  status: AccountStatus;
  exp: number;
};

export const getPayloadFromToken = (token: string): UserDetail => {
  const user_detail: UserDetail = jwtDecode(token);
  return user_detail;
};

export const getRoleFromToken = (token: string): Role => {
  const role = getPayloadFromToken(token).role;
  return role;
};

export const getIdFromToken = (token: string): string => {
  const id: string = getPayloadFromToken(token).id;
  return id;
};

export const getStatusFromToken = (token: string): AccountStatus => {
  const status: AccountStatus = getPayloadFromToken(token).status;
  return status;
};
