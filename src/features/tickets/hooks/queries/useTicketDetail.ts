import { useQuery } from "@tanstack/react-query";
import { ticketsApi } from "../../api/ticketsApi";
import { ticketKeys } from "./queryKeys";

export const useTicketDetail = (ticketId: string | null) =>
  useQuery({
    queryKey: ticketKeys.detail(ticketId!),
    queryFn: () => ticketsApi.getTicketById(ticketId!),
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });
