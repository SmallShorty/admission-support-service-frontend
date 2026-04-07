import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { ticketKeys } from "../queries/queryKeys";

export const useTakeTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => ticketsApi.takeTicket(ticketId),
    onSuccess: (data, ticketId) => {
      queryClient.setQueryData(ticketKeys.detail(ticketId), data);
      console.log("Ticket taken successfully");
    },
    onError: (error: Error) => {
      console.log(error.message || "Failed to take ticket");
    },
  });
};
