import { useMutation } from "react-query";
import { CalendarAPI } from "../apis/CalendarAPI";

export const useDeleteHeadSupervisor = () => {
  const { mutate, isLoading, error, data } = useMutation({
    mutationKey: ["delete", "head supervisor"],
    mutationFn: async ({}: {}) => {
      return await CalendarAPI._deleteHeadSupervisor();
    },
  });

  return { mutate, isLoading, error, data };
};
