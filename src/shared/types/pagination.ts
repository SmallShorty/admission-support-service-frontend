// Соответствует PaginatedResponseDto на бэкенде
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

// Базовые параметры запроса (Query Params)
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Курсорная пагинация (если бэк поддерживает CursorPaginatedResponseDto)
export interface CursorPaginationParams {
  limit?: number;
  cursor?: string;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface PaginationState<T = any> {
  items: T[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

export const initialPaginationState: PaginationState = {
  items: [],
  total: 0,
  hasMore: false,
  offset: 0,
  limit: 20, // Синхронизировано с дефолтом бэкенда
  loading: false,
  error: null,
};

// Параметры, которые React Query передает в fetcher
export interface InfiniteScrollParams {
  offsetParam?: number; // Раньше был pageParam
  limit?: number;
}

// Ответ, который удобно ложится в getNextPageParam
export interface InfiniteScrollResponse<T> {
  items: T[]; // На бэке это поле называется items
  nextOffset: number | null;
  hasMore: boolean;
  total: number;
}
