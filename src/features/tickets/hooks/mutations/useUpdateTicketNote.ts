import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { ticketKeys } from "../queries/queryKeys";

export const useUpdateTicketNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      text,
    }: {
      ticketId: string;
      text: string;
    }) => ticketsApi.updateTicketNote(ticketId, { text }),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
    },
  });
};
