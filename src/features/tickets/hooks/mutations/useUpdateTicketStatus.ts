import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { TicketStatus } from "../../model/types";
import { ticketKeys } from "../queries/queryKeys";

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: TicketStatus.RESOLVED | TicketStatus.CLOSED;
    }) => ticketsApi.updateTicketStatus(ticketId, { status }),
    onSuccess: (data, { ticketId }) => {
      queryClient.setQueryData(ticketKeys.detail(ticketId), data);
      console.log(`Ticket ${data.status.toLowerCase()} successfully`);
    },
    onError: (error: Error) => {
      console.log(error.message || "Failed to update status");
    },
  });
};
