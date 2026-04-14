/**
 * Query key factory for user-related queries.
 *
 * Using a factory pattern ensures a single source of truth for query keys,
 * and enables precise cache invalidation (e.g., invalidating all list variants
 * without touching detail queries).
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 */
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number; search: string }) =>
    [...userKeys.lists(), filters] as const,
};
