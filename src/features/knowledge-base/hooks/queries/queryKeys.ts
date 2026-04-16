export const variableKeys = {
  all: ["variables"] as const,
  list: () => [...variableKeys.all, "list"] as const,
};
