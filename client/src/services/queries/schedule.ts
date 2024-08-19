import { useQuery } from "@tanstack/react-query";
import { fetchSchedulesAndAssignments } from "../api/schedule-api";

export const useSchedulesAndAssignments = () => {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedulesAndAssignments,
  });
};
