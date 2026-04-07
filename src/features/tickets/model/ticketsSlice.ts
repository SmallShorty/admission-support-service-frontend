// features/tickets/store/ticketsUiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TicketStatus } from "./types";

interface TicketsState {
  // Queue filters
  availableQueueOffset: number;
  allQueueOffset: number;
  allQueueStatusFilter: TicketStatus[];
  allQueueAgentFilter: string | null;

  // Selection
  selectedTicketId: string | null;

  // Modals
  isEscalateModalOpen: boolean;
  escalateTicketId: string | null;

  // Pagination
  availableQueuePage: number;
  allQueuePage: number;
}

const initialState: TicketsState = {
  availableQueueOffset: 0,
  allQueueOffset: 0,
  allQueueStatusFilter: [],
  allQueueAgentFilter: null,
  selectedTicketId: null,
  isEscalateModalOpen: false,
  escalateTicketId: null,
  availableQueuePage: 1,
  allQueuePage: 1,
};

const ticketsUiSlice = createSlice({
  name: "ticketsUi",
  initialState,
  reducers: {
    setAvailableQueueOffset: (state, action: PayloadAction<number>) => {
      state.availableQueueOffset = action.payload;
    },
    setAllQueueOffset: (state, action: PayloadAction<number>) => {
      state.allQueueOffset = action.payload;
    },
    setAllQueueStatusFilter: (state, action: PayloadAction<TicketStatus[]>) => {
      state.allQueueStatusFilter = action.payload;
      state.allQueueOffset = 0; // Reset pagination on filter change
    },
    setAllQueueAgentFilter: (state, action: PayloadAction<string | null>) => {
      state.allQueueAgentFilter = action.payload;
      state.allQueueOffset = 0;
    },
    setSelectedTicketId: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
    },
    openEscalateModal: (state, action: PayloadAction<string>) => {
      state.isEscalateModalOpen = true;
      state.escalateTicketId = action.payload;
    },
    closeEscalateModal: (state) => {
      state.isEscalateModalOpen = false;
      state.escalateTicketId = null;
    },
    nextAvailableQueuePage: (state) => {
      state.availableQueuePage += 1;
      state.availableQueueOffset += 50;
    },
    prevAvailableQueuePage: (state) => {
      state.availableQueuePage -= 1;
      state.availableQueueOffset -= 50;
    },
  },
});

export const {
  setAvailableQueueOffset,
  setAllQueueOffset,
  setAllQueueStatusFilter,
  setAllQueueAgentFilter,
  setSelectedTicketId,
  openEscalateModal,
  closeEscalateModal,
  nextAvailableQueuePage,
  prevAvailableQueuePage,
} = ticketsUiSlice.actions;

export default ticketsUiSlice.reducer;
