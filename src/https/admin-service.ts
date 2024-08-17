import { Ailment, IAppointmentUpdate, ICreateMedicationForm } from "@/types";
import { api } from "./api";
import { API_END_POINTS } from "./constants";

export const getMedicineList = async (queryParams: Record<string, string>) => {
  return api.get(API_END_POINTS.MEDICINES_LIST, { params: queryParams });
};

export const createMedicine = async (payload: ICreateMedicationForm) => {
  return api.post(API_END_POINTS.MEDICINE_CREATE, payload);
};

export const updateMedicine = async (
  payload: ICreateMedicationForm,
  id: string
) => {
  return api.patch(API_END_POINTS.MEDICINE_UPDATE + `/${id}`, payload);
};

export const deleteMedicine = async (id: string) => {
  return api.delete(API_END_POINTS.MEDICINE_DELETE + `/${id}`);
};

export const getAilmentList = async (queryParams?: Record<string, string>) => {
  return api.get(API_END_POINTS.AILMENT_LISt, { params: queryParams });
};

export const createAilment = async (payload: Ailment) => {
  return api.post(API_END_POINTS.AILMENT_CREATE, payload);
};

export const updateAilment = async (payload: Ailment, id: string) => {
  return api.patch(API_END_POINTS.AILMENT_UPDATE + `/${id}`, payload);
};

export const deleteAilment = async (id: string) => {
  return api.delete(API_END_POINTS.AILMENT_DELETE + `/${id}`);
};

export const getAppointmentList = async (
  queryParams: Record<string, string>
) => {
  return api.get(API_END_POINTS.APPOINTMENT_LIST, { params: queryParams });
};

export const getAppointmentDetails = async (id: string) => {
  return api.get(API_END_POINTS.APPOINTMENT_DETAILS + `/${id}`);
};

export const updateAppointment = async (payload: IAppointmentUpdate) => {
  return api.post(API_END_POINTS.APPOINTMENT_UPDATE, payload);
};

export const getPatientList = async (queryParams: Record<string, string>) => {
  return api.get(API_END_POINTS.PATIENTS_LIST, { params: queryParams });
};

export const getDashboardMetrics = async (id: string = "") => {
  return api.get(API_END_POINTS.DASHBOARD_METRICS + `/${id}`);
};

export const getFeedbackList = async (queryParams: Record<string, string>) => {
  return api.get(API_END_POINTS.FEEDBACK_LIST, { params: queryParams });
};
