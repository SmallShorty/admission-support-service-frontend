import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { ticketKeys } from "./queryKeys";

export const useTicketCounts = () => {
  return useQuery({
    queryKey: ticketKeys.counts(),
    queryFn: () => ticketsApi.getTicketCounts(),
  });
};
