import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { AdmissionIntentCategory } from "../../model/types";
import { ticketKeys } from "../queries/queryKeys";

export const useUpdateTicketCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      category,
    }: {
      ticketId: string;
      category: AdmissionIntentCategory;
    }) => ticketsApi.updateTicketCategory(ticketId, { category }),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.my() });
    },
  });
};
