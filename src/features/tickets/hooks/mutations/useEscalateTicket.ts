import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/app/hooks";
import { ticketsApi } from "@/features/tickets/api/ticketsApi";
import { EscalateTicketPayload } from "../../model/types";
import { closeEscalateModal } from "../../model/ticketsSlice";
import { ticketKeys } from "../queries/queryKeys";

export const useEscalateTicket = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: string;
      payload: EscalateTicketPayload;
    }) => ticketsApi.escalateTicket(ticketId, payload),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.my() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.counts() });
      dispatch(closeEscalateModal());
    },
    onError: (error: Error) => {
      console.error("Failed to escalate ticket:", error.message);
    },
  });
};
