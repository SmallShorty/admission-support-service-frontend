import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Ticket, TicketListItem } from "./types";
import { PaginatedResponse } from "@/shared/types/pagination";

interface TicketsState {
  // Мои активные тикеты
  myTickets: {
    items: Ticket[];
    loading: boolean;
    error: string | null;
  };

  // Доступная очередь
  availableQueue: {
    items: TicketListItem[];
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
    loading: boolean;
    error: string | null;
  };

  // Общая очередь (админ)
  allQueue: {
    items: Ticket[];
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
    loading: boolean;
    error: string | null;
  };

  // Выбранный тикет (для деталей)
  selectedTicket: {
    data: Ticket | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: TicketsState = {
  myTickets: {
    items: [],
    loading: false,
    error: null,
  },
  availableQueue: {
    items: [],
    total: 0,
    hasMore: false,
    offset: 0,
    limit: 50,
    loading: false,
    error: null,
  },
  allQueue: {
    items: [],
    total: 0,
    hasMore: false,
    offset: 0,
    limit: 50,
    loading: false,
    error: null,
  },
  selectedTicket: {
    data: null,
    loading: false,
    error: null,
  },
};

export const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // ========== My Tickets ==========
    setMyTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.myTickets.items = action.payload;
      state.myTickets.loading = false;
      state.myTickets.error = null;
    },

    setMyTicketsLoading: (state, action: PayloadAction<boolean>) => {
      state.myTickets.loading = action.payload;
    },

    setMyTicketsError: (state, action: PayloadAction<string>) => {
      state.myTickets.error = action.payload;
      state.myTickets.loading = false;
    },

    addToMyTickets: (state, action: PayloadAction<Ticket>) => {
      const exists = state.myTickets.items.some(
        (t) => t.id === action.payload.id,
      );
      if (!exists) {
        state.myTickets.items.push(action.payload);
      }
    },

    removeFromMyTickets: (state, action: PayloadAction<string>) => {
      state.myTickets.items = state.myTickets.items.filter(
        (t) => t.id !== action.payload,
      );
    },

    updateTicketInMyTickets: (state, action: PayloadAction<Ticket>) => {
      const index = state.myTickets.items.findIndex(
        (t) => t.id === action.payload.id,
      );
      if (index !== -1) {
        state.myTickets.items[index] = action.payload;
      }
    },

    // ========== Available Queue ==========
    setAvailableQueue: (
      state,
      action: PayloadAction<PaginatedResponse<TicketListItem>>,
    ) => {
      state.availableQueue.items = action.payload.items;
      state.availableQueue.total = action.payload.total;
      state.availableQueue.hasMore = action.payload.hasMore;
      state.availableQueue.offset = action.payload.offset;
      state.availableQueue.limit = action.payload.limit;
      state.availableQueue.loading = false;
      state.availableQueue.error = null;
    },

    setAvailableQueueLoading: (state, action: PayloadAction<boolean>) => {
      state.availableQueue.loading = action.payload;
    },

    setAvailableQueueError: (state, action: PayloadAction<string>) => {
      state.availableQueue.error = action.payload;
      state.availableQueue.loading = false;
    },

    addToAvailableQueue: (state, action: PayloadAction<TicketListItem>) => {
      state.availableQueue.items.unshift(action.payload);
      state.availableQueue.total += 1;
    },

    removeFromAvailableQueue: (state, action: PayloadAction<string>) => {
      state.availableQueue.items = state.availableQueue.items.filter(
        (t) => t.id !== action.payload,
      );
      state.availableQueue.total -= 1;
    },

    // ========== All Queue (Admin) ==========
    setAllQueue: (state, action: PayloadAction<PaginatedResponse<Ticket>>) => {
      state.allQueue.items = action.payload.items;
      state.allQueue.total = action.payload.total;
      state.allQueue.hasMore = action.payload.hasMore;
      state.allQueue.offset = action.payload.offset;
      state.allQueue.limit = action.payload.limit;
      state.allQueue.loading = false;
      state.allQueue.error = null;
    },

    setAllQueueLoading: (state, action: PayloadAction<boolean>) => {
      state.allQueue.loading = action.payload;
    },

    setAllQueueError: (state, action: PayloadAction<string>) => {
      state.allQueue.error = action.payload;
      state.allQueue.loading = false;
    },

    updateTicketInAllQueue: (state, action: PayloadAction<Ticket>) => {
      const index = state.allQueue.items.findIndex(
        (t) => t.id === action.payload.id,
      );
      if (index !== -1) {
        state.allQueue.items[index] = action.payload;
      }
    },

    // ========== Selected Ticket ==========
    setSelectedTicket: (state, action: PayloadAction<Ticket>) => {
      state.selectedTicket.data = action.payload;
      state.selectedTicket.loading = false;
      state.selectedTicket.error = null;
    },

    setSelectedTicketLoading: (state, action: PayloadAction<boolean>) => {
      state.selectedTicket.loading = action.payload;
    },

    setSelectedTicketError: (state, action: PayloadAction<string>) => {
      state.selectedTicket.error = action.payload;
      state.selectedTicket.loading = false;
    },

    clearSelectedTicket: (state) => {
      state.selectedTicket.data = null;
      state.selectedTicket.loading = false;
      state.selectedTicket.error = null;
    },

    // ========== Common ==========
    resetTicketsState: () => initialState,
  },
});

export const {
  // My Tickets
  setMyTickets,
  setMyTicketsLoading,
  setMyTicketsError,
  addToMyTickets,
  removeFromMyTickets,
  updateTicketInMyTickets,

  // Available Queue
  setAvailableQueue,
  setAvailableQueueLoading,
  setAvailableQueueError,
  addToAvailableQueue,
  removeFromAvailableQueue,

  // All Queue
  setAllQueue,
  setAllQueueLoading,
  setAllQueueError,
  updateTicketInAllQueue,

  // Selected Ticket
  setSelectedTicket,
  setSelectedTicketLoading,
  setSelectedTicketError,
  clearSelectedTicket,

  // Common
  resetTicketsState,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
