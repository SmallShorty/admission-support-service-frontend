import { RootState } from "@/app/store";

// ========== My Tickets Selectors ==========
export const selectMyTickets = (state: RootState) =>
  state.tickets.myTickets.items;
export const selectMyTicketsLoading = (state: RootState) =>
  state.tickets.myTickets.loading;
export const selectMyTicketsError = (state: RootState) =>
  state.tickets.myTickets.error;
export const selectMyTicketsCount = (state: RootState) =>
  state.tickets.myTickets.items.length;

// ========== Available Queue Selectors ==========
export const selectAvailableQueue = (state: RootState) =>
  state.tickets.availableQueue.items;
export const selectAvailableQueueTotal = (state: RootState) =>
  state.tickets.availableQueue.total;
export const selectAvailableQueueHasMore = (state: RootState) =>
  state.tickets.availableQueue.hasMore;
export const selectAvailableQueueOffset = (state: RootState) =>
  state.tickets.availableQueue.offset;
export const selectAvailableQueueLoading = (state: RootState) =>
  state.tickets.availableQueue.loading;
export const selectAvailableQueueError = (state: RootState) =>
  state.tickets.availableQueue.error;

// ========== All Queue Selectors (Admin) ==========
export const selectAllQueue = (state: RootState) =>
  state.tickets.allQueue.items;
export const selectAllQueueTotal = (state: RootState) =>
  state.tickets.allQueue.total;
export const selectAllQueueHasMore = (state: RootState) =>
  state.tickets.allQueue.hasMore;
export const selectAllQueueLoading = (state: RootState) =>
  state.tickets.allQueue.loading;
export const selectAllQueueError = (state: RootState) =>
  state.tickets.allQueue.error;

// ========== Selected Ticket Selectors ==========
export const selectSelectedTicket = (state: RootState) =>
  state.tickets.selectedTicket.data;
export const selectSelectedTicketLoading = (state: RootState) =>
  state.tickets.selectedTicket.loading;
export const selectSelectedTicketError = (state: RootState) =>
  state.tickets.selectedTicket.error;

// ========== Helper Selectors ==========
export const selectTicketById = (state: RootState, ticketId: string) => {
  // Сначала ищем в моих тикетах
  const myTicket = state.tickets.myTickets.items.find((t) => t.id === ticketId);
  if (myTicket) return myTicket;

  // Потом в общей очереди
  const allQueueTicket = state.tickets.allQueue.items.find(
    (t) => t.id === ticketId,
  );
  if (allQueueTicket) return allQueueTicket;

  // Потом в доступной очереди
  const availableTicket = state.tickets.availableQueue.items.find(
    (t) => t.id === ticketId,
  );
  if (availableTicket) return availableTicket;

  return null;
};

export const selectMyTicketIds = (state: RootState) =>
  state.tickets.myTickets.items.map((t) => t.id);

export const selectAvailableQueueTicketIds = (state: RootState) =>
  state.tickets.availableQueue.items.map((t) => t.id);
