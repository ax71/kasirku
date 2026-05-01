/**
 * Query key factories untuk Admin Dashboard queries.
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  chart: () => [...dashboardKeys.all, "chart"] as const,
  recentOrders: () => [...dashboardKeys.all, "recent-orders"] as const,
  topProducts: () => [...dashboardKeys.all, "top-products"] as const,
};
