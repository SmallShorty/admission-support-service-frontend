import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { ticketKeys } from "./queryKeys";

export const useAllQueue = (limit = 50, offset = 0, filters?: any) => {
  return useQuery({
    queryKey: ticketKeys.allQueue(limit, offset, filters),
    queryFn: () => ticketsApi.getAllQueue(limit, offset, filters),
    enabled: !!filters?.isAdmin,
  });
};
