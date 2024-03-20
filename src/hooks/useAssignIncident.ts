import { useMutation } from "react-query";
import { AssignIncidentParams, IncidentApi } from "../apis/IncidentAPI";

export const useAssignIncident = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "assign-incident",
    mutationFn: async (params: AssignIncidentParams) => {
      return await IncidentApi._assignIncident(params);
    },
  });

  return { mutate, isLoading, error, data };
};
