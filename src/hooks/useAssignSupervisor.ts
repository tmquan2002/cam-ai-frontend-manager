import { useMutation } from "react-query";
import { AssignSuperVisorParams, CalendarAPI } from "../apis/CalendarAPI";

export const useAssignSupervisor = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: "assign-supervisor",
    mutationFn: async (params: AssignSuperVisorParams) => {
      return await CalendarAPI._assignSuperVisor(params);
    },
  });

  return { mutate, isLoading, error, data };
};
