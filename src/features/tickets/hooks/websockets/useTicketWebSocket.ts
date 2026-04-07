import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { TicketListItem, TicketDetail } from "../../model/types";
import { ticketKeys } from "../queries/queryKeys";

let socket: Socket | null = null;

export const useTicketWebSocket = (
  token: string | null,
  isAuthenticated: boolean,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    // Connect to WebSocket
    socket = io("http://localhost:3000", {
      path: "/tickets",
      auth: { token },
      transports: ["websocket"],
    });

    // Handle ticket updates
    socket.on(
      "ticket:updated",
      (data: { ticket: TicketListItem; updatedBy: string }) => {
        console.log("WebSocket: ticket updated", data.ticket.id);

        // Update individual ticket in cache
        queryClient.setQueryData(
          ticketKeys.detail(data.ticket.id),
          data.ticket,
        );

        // Invalidate list queries to reflect changes in queues
        queryClient.invalidateQueries({
          queryKey: ticketKeys.available(50, 0),
        });
        queryClient.invalidateQueries({
          queryKey: ticketKeys.my(),
        });
        queryClient.invalidateQueries({
          queryKey: ticketKeys.counts(),
        });
      },
    );

    // Handle queue updates
    socket.on(
      "queue:updated",
      (data: { action: string; ticketId?: string }) => {
        console.log("WebSocket: queue updated", data.action);

        // Invalidate queue queries
        queryClient.invalidateQueries({
          queryKey: ticketKeys.available(50, 0),
        });
        queryClient.invalidateQueries({
          queryKey: ticketKeys.allQueue(50, 0),
        });
      },
    );

    // Handle new messages
    socket.on("message:new", (data: { ticketId: string; message: any }) => {
      console.log("WebSocket: new message for ticket", data.ticketId);

      // Update ticket's lastMessageAt in cache
      queryClient.setQueryData(
        ticketKeys.detail(data.ticketId),
        (old: TicketDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            lastMessageAt: data.message.createdAt,
          };
        },
      );
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [token, isAuthenticated, queryClient]);

  return socket;
};
