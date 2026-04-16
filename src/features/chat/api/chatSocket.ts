// src/features/chat/api/chatSocket.ts
import { io, Socket } from "socket.io-client";
import { store } from "@/app/store";
import {
  addMessage,
  setConnected,
  setTypingStatus,
  incrementUnreadCount,
  updateMessageStatus,
  setVariableError,
} from "../model/chatSlice";
import { TicketMessage, SendMessagePayload, VariableResolutionError } from "../model/types";

class ChatSocketService {
  private socket: Socket | null = null;
  private subscribedTickets: Set<string> = new Set();

  connect(token: string) {
    if (this.socket?.connected) {
      console.log("[ChatSocket] Already connected");
      return;
    }

    const apiUrl = import.meta.env.VITE_CORE_API_URL || "http://localhost:3000";
    // Strip /api path prefix — WebSocket namespace is at the server origin, not the REST base
    const wsBase = new URL(apiUrl).origin;

    this.socket = io(`${wsBase}/tickets`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("[ChatSocket] Connected successfully");
      store.dispatch(setConnected(true));
      this.joinQueueRooms();
    });

    this.socket.on("disconnect", () => {
      console.log("[ChatSocket] Disconnected");
      store.dispatch(setConnected(false));
    });

    this.socket.on("connect_error", (error) => {
      console.error("[ChatSocket] Connection error:", error);
    });

    this.socket.on("newTicketMessage", (message: TicketMessage) => {
      console.log("[ChatSocket] New message received:", message);
      store.dispatch(addMessage(message));

      const state = store.getState();
      if (state.chat.activeChatId !== message.ticketId) {
        store.dispatch(incrementUnreadCount({ ticketId: message.ticketId }));
      }
    });

    this.socket.on(
      "userTyping",
      (data: { userId: string; ticketId: string; isTyping: boolean }) => {
        console.log("[ChatSocket] User typing:", data);
        store.dispatch(
          setTypingStatus({
            ticketId: data.ticketId,
            userId: data.userId,
            isTyping: data.isTyping,
          }),
        );
      },
    );

    this.socket.on(
      "messagesRead",
      (data: { userId: string; ticketId: string; messageIds: number[] }) => {
        console.log("[ChatSocket] Messages read:", data);
        data.messageIds.forEach((messageId) => {
          store.dispatch(
            updateMessageStatus({
              ticketId: data.ticketId,
              messageId,
              status: "SEEN",
              seenAt: new Date().toISOString(),
            }),
          );
        });
      },
    );

    this.socket.on("variableResolutionError", (error: VariableResolutionError) => {
      console.log("[ChatSocket] Variable resolution error:", error);
      store.dispatch(setVariableError(error));
    });
  }

  private joinQueueRooms() {
    if (!this.socket) return;

    this.socket.emit("joinAvailableQueue");
    console.log("[ChatSocket] Joined available queue room");

    const state = store.getState();
    const role = state.account.data?.role;
    if (role === "ADMIN" || role === "SUPERVISOR") {
      this.socket.emit("joinAllQueue");
      console.log("[ChatSocket] Joined all queue room");
    }
  }

  joinTicketChat(ticketId: string) {
    if (!this.socket || this.subscribedTickets.has(ticketId)) return;

    this.socket.emit("joinTicketChat", { ticketId });
    this.subscribedTickets.add(ticketId);
    console.log(`[ChatSocket] Joined ticket room: ${ticketId}`);
  }

  leaveTicketChat(ticketId: string) {
    if (!this.socket || !this.subscribedTickets.has(ticketId)) return;

    this.socket.emit("leaveTicketChat", { ticketId });
    this.subscribedTickets.delete(ticketId);
    console.log(`[ChatSocket] Left ticket room: ${ticketId}`);
  }

  sendMessage(data: SendMessagePayload) {
    if (!this.socket) {
      console.error("[ChatSocket] Cannot send message: socket not connected");
      return;
    }

    this.socket.emit("sendTicketMessage", data, (response: TicketMessage) => {
      console.log("[ChatSocket] Message sent, server response:", response);
    });
  }

  sendTypingStatus(ticketId: string, isTyping: boolean) {
    if (!this.socket) return;
    const userId = store.getState().account.data?.id;
    if (!userId) return;

    this.socket.emit("typing", { ticketId, userId, isTyping });
  }

  markMessagesRead(ticketId: string, messageIds: number[]) {
    if (!this.socket || messageIds.length === 0) return;
    const userId = store.getState().account.data?.id;
    if (!userId) return;

    this.socket.emit("markMessagesRead", { ticketId, userId, messageIds });
  }

  disconnect() {
    if (this.socket) {
      this.subscribedTickets.clear();
      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setConnected(false));
      console.log("[ChatSocket] Disconnected manually");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getSubscribedTickets(): string[] {
    return Array.from(this.subscribedTickets);
  }
}

export const chatSocket = new ChatSocketService();
