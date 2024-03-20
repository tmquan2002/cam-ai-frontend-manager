import { useMutation } from "react-query";
import { IncidentApi } from "../apis/IncidentAPI";

export const useRejectIncidentById = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["reject", "incident"],
    mutationFn: async (incidentId: string) => {
      return await IncidentApi._rejectIncident(incidentId);
    },
  });

  return { mutate, isLoading, error, data };
};
