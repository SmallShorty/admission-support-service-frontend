// src/features/chat/api/chatSocket.ts
import { io, Socket } from "socket.io-client";
import { store } from "@/app/store";
import {
  addMessage,
  setConnected,
  setTypingStatus,
  incrementUnreadCount,
  updateMessageStatus,
} from "../model/chatSlice";
import {
  updateTicketInMyTickets,
  removeFromAvailableQueue,
} from "@/features/tickets/model/ticketsSlice";
import { TicketMessage, SendMessagePayload } from "../model/types";

class ChatSocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private userRole: string | null = null;
  private subscribedTickets: Set<string> = new Set();

  connect(userId: string, userRole: string) {
    if (this.socket?.connected) {
      console.log("[ChatSocket] Already connected");
      return;
    }

    this.userId = userId;
    this.userRole = userRole;

    const VITE_CORE_API_URL =
      import.meta.env.VITE_CORE_API_URL || "http://localhost:3000";

    this.socket = io(`${VITE_CORE_API_URL}/tickets`, {
      query: { userId, role: userRole },
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

    // Новое сообщение
    this.socket.on("newTicketMessage", (message: TicketMessage) => {
      console.log("[ChatSocket] New message received:", message);
      store.dispatch(addMessage(message));

      // Увеличиваем счетчик непрочитанных если чат не активен
      const state = store.getState();
      if (state.chat.activeChatId !== message.ticketId) {
        store.dispatch(incrementUnreadCount({ ticketId: message.ticketId }));
      }
    });

    // Обновление тикета
    this.socket.on(
      "ticketUpdated",
      (data: { ticket: any; updatedBy: string }) => {
        console.log("[ChatSocket] Ticket updated:", data);
        store.dispatch(updateTicketInMyTickets(data.ticket));
      },
    );

    // Обновление очереди
    this.socket.on(
      "queueUpdated",
      (data: { action: string; ticket: any; ticketId?: string }) => {
        console.log("[ChatSocket] Queue updated:", data);
        if (data.action === "removed" && data.ticketId) {
          store.dispatch(removeFromAvailableQueue(data.ticketId));
        }
      },
    );

    // Индикатор печатания
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

    // Статус прочтения сообщений
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
  }

  private joinQueueRooms() {
    if (!this.socket) return;

    this.socket.emit("joinAvailableQueue");
    console.log("[ChatSocket] Joined available queue room");

    if (this.userRole === "ADMIN" || this.userRole === "SUPERVISOR") {
      this.socket.emit("joinAllQueue", { role: this.userRole });
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
    if (!this.socket || !this.userId) return;

    this.socket.emit("typing", {
      ticketId,
      userId: this.userId,
      isTyping,
    });
  }

  markMessagesRead(ticketId: string, messageIds: number[]) {
    if (!this.socket || !this.userId || messageIds.length === 0) return;

    this.socket.emit("markMessagesRead", {
      ticketId,
      userId: this.userId,
      messageIds,
    });
  }

  disconnect() {
    if (this.socket) {
      this.subscribedTickets.clear();
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      this.userRole = null;
      store.dispatch(setConnected(false));
      console.log("[ChatSocket] Disconnected manually");
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSubscribedTickets(): string[] {
    return Array.from(this.subscribedTickets);
  }
}

export const chatSocket = new ChatSocketService();
