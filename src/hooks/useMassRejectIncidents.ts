import { useMutation } from "react-query";
import { IncidentApi, MassRejectIncidentParams } from "../apis/IncidentAPI";

export const useMassRejectIncidents = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["massReject", "incident"],
    mutationFn: async (params: MassRejectIncidentParams) => {
      return await IncidentApi._massRejectIncident(params);
    },
  });

  return { mutate, isLoading, error, data };
};
