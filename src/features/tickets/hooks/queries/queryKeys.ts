export const ticketKeys = {
  all: ["tickets"] as const,
  my: () => [...ticketKeys.all, "my"] as const,
  available: (limit: number, offset: number) =>
    [...ticketKeys.all, "available", { limit, offset }] as const,
  allQueue: (limit: number, offset: number, filters?: any) =>
    [...ticketKeys.all, "allQueue", { limit, offset, filters }] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
  counts: () => [...ticketKeys.all, "counts"] as const,
};
