import { useMutation } from "react-query";
import { CalendarAPI } from "../apis/CalendarAPI";

export const useDeleteSupervisor = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["delete", "supervisor"],
    mutationFn: async ({}: {}) => {
      return await CalendarAPI._deleteSupervisor();
    },
  });

  return { mutate, isLoading, error, data };
};
