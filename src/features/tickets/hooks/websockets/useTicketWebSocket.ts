import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatSocket } from "@/features/chat/api/chatSocket";
import { TicketDetail, TicketListItem } from "../../model/types";
import { ticketKeys } from "../queries/queryKeys";

export const useTicketWebSocket = (
  token: string | null,
  isAuthenticated: boolean,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = chatSocket.getSocket();
    if (!socket) return;

    const handleTicketUpdated = (data: {
      ticket: TicketDetail;
      updatedBy: string;
      timestamp: string;
    }) => {
      console.log("[TicketWS] ticketUpdated:", data.ticket.id);
      queryClient.setQueryData(ticketKeys.detail(data.ticket.id), data.ticket);
      queryClient.invalidateQueries({ queryKey: ticketKeys.my() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.counts() });
    };

    const handleQueueUpdated = (data: {
      action: string;
      ticket?: TicketListItem;
      ticketId?: string;
      timestamp: string;
    }) => {
      console.log("[TicketWS] queueUpdated:", data.action);
      queryClient.invalidateQueries({ queryKey: ticketKeys.all });
    };

    const handleAllQueueUpdated = (data: {
      action: string;
      ticket?: TicketListItem;
      timestamp: string;
    }) => {
      console.log("[TicketWS] allQueueUpdated:", data.action);
      queryClient.invalidateQueries({ queryKey: ticketKeys.allQueue(50, 0) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.counts() });
    };

    const handleNewTicketAvailable = (data: {
      ticket: TicketListItem;
      timestamp: string;
    }) => {
      console.log("[TicketWS] newTicketAvailable:", data.ticket.id);
      queryClient.invalidateQueries({ queryKey: ticketKeys.available(50, 0) });
    };

    const handleNewTicketCreated = (data: {
      ticket: TicketListItem;
      timestamp: string;
    }) => {
      console.log("[TicketWS] newTicketCreated:", data.ticket.id);
      queryClient.invalidateQueries({ queryKey: ticketKeys.allQueue(50, 0) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.counts() });
    };

    const handleTicketAssigned = (data: {
      ticket: TicketListItem;
      timestamp: string;
    }) => {
      console.log("[TicketWS] ticketAssigned:", data.ticket.id);
      queryClient.invalidateQueries({ queryKey: ticketKeys.my() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.counts() });
    };

    socket.on("ticketUpdated", handleTicketUpdated);
    socket.on("queueUpdated", handleQueueUpdated);
    socket.on("allQueueUpdated", handleAllQueueUpdated);
    socket.on("newTicketAvailable", handleNewTicketAvailable);
    socket.on("newTicketCreated", handleNewTicketCreated);
    socket.on("ticketAssigned", handleTicketAssigned);

    return () => {
      socket.off("ticketUpdated", handleTicketUpdated);
      socket.off("queueUpdated", handleQueueUpdated);
      socket.off("allQueueUpdated", handleAllQueueUpdated);
      socket.off("newTicketAvailable", handleNewTicketAvailable);
      socket.off("newTicketCreated", handleNewTicketCreated);
      socket.off("ticketAssigned", handleTicketAssigned);
    };
  }, [token, isAuthenticated, queryClient]);
};
