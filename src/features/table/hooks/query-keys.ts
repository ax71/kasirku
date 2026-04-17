export const tableKeys = {
  all: ["tables"] as const,
  lists: () => [...tableKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...tableKeys.lists(), filters] as const,
  details: () => [...tableKeys.all, "detail"] as const,
  detail: (id: string | number) => [...tableKeys.details(), id] as const,
};
