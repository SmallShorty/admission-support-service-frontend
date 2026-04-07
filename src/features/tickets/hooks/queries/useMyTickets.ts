import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { ticketKeys } from "./queryKeys";

export const useMyTickets = () => {
  return useQuery({
    queryKey: ticketKeys.my(),
    queryFn: () => ticketsApi.getMyTickets(),
  });
};
