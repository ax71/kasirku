/**
 * Query key factories for menu and category queries.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 */
export const menuKeys = {
  all: ["menu"] as const,
  lists: () => [...menuKeys.all, "list"] as const,
  list: (filters: {
    page: number;
    limit: number;
    search: string;
    categoryId?: string;
  }) => [...menuKeys.lists(), filters] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};
