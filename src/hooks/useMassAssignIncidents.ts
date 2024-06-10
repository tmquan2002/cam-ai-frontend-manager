import { useMutation } from "react-query";
import { IncidentApi, MassAssignIncidentParams } from "../apis/IncidentAPI";

export const useMassAssignIncidents = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["massAssign", "incident"],
    mutationFn: async (params: MassAssignIncidentParams) => {
      return await IncidentApi._massAssignIncident(params);
    },
  });

  return { mutate, isLoading, error, data };
};
