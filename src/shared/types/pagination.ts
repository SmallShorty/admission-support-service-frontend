// Базовый тип для пагинированного ответа
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

// Базовый тип для пагинированного запроса (offset-based)
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Базовый тип для пагинированного запроса (cursor-based)
export interface CursorPaginationParams {
  limit?: number;
  cursor?: string;
}

// Тип для пагинированного ответа с cursor-based пагинацией
export interface CursorPaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  nextCursor: string | null;
}

// Тип для состояния пагинации в Redux
export interface PaginationState {
  items: any[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

// Тип для начального состояния пагинации
export const initialPaginationState: PaginationState = {
  items: [],
  total: 0,
  hasMore: false,
  offset: 0,
  limit: 50,
  loading: false,
  error: null,
};

// Тип для параметров бесконечного скролла (React Query)
export interface InfiniteScrollParams {
  pageParam?: number;
  limit?: number;
}

// Тип для ответа бесконечного скролла
export interface InfiniteScrollResponse<T> {
  data: T[];
  nextOffset: number | null;
  hasMore: boolean;
  total: number;
}
