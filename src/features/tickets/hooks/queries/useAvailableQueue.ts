import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { ticketKeys } from "./queryKeys";

export const useAvailableQueue = (limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ticketKeys.available(limit, offset),
    queryFn: () => ticketsApi.getAvailableQueue(limit, offset),
  });
};
