export enum MessageType {
  FROM_CUSTOMER = "FROM_CUSTOMER",
  FROM_AGENT = "FROM_AGENT",
  SYSTEM = "SYSTEM",
}
export enum DeliveryStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  SEEN = "SEEN",
}
export interface MessageAuthor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface TicketMessage {
  id: number;
  ticketId: string;
  authorId: string;
  authorType: MessageType;
  content: string;
  status: DeliveryStatus;
  deliveredAt: string | null;
  seenAt: string | null;
  createdAt: string;
  author: MessageAuthor;
}
export interface MessagesResponse {
  items: TicketMessage[];
  hasMore: boolean;
  nextCursor: string | null;
}
export interface SendMessagePayload {
  ticketId: string;
  authorId: string;
  content: string;
  authorType: MessageType;
}
export interface NewMessageEvent {
  message: TicketMessage;
  ticketId: string;
}
export interface TypingEvent {
  ticketId: string;
  userId: string;
  isTyping: boolean;
}
export interface MessageReadEvent {
  ticketId: string;
  userId: string;
  messageIds: number[];
  timestamp: string;
}
export interface ChatState {
  messagesByTicket: Record<string, TicketMessage[]>;
  openChats: string[];
  activeChatId: string | null;
  isConnected: boolean;
  typingUsers: Record<string, string[]>;
  unreadCounts: Record<string, number>;
  hasMoreMessages: Record<string, boolean>;
  nextCursors: Record<string, string | null>;
  loadingMessages: Record<string, boolean>;
  variableError: VariableResolutionError | null;
}
export interface LoadMessagesParams {
  ticketId: string;
  limit?: number;
  cursor?: string | null;
}

export interface VariableResolvedDto {
  name: string;
  description: string;
  resolvedValue: string;
}

export interface VariableResolutionError {
  code: string;
  missingVariables: string[];
  message: string;
}
