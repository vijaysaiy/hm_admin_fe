import { IloginForm } from "@/types";
import { api } from "./api";
import { API_END_POINTS } from "./constants";

export const login = async (payload: IloginForm) => {
  return api.post(API_END_POINTS.LOGIN, payload);
};

export const getAdminDetails = async () => {
  return api.get(API_END_POINTS.ADMIN_DETAILS);
};
