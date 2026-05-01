import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentOrders,
  getSalesChartData,
  getTopSellingProducts,
} from "../services/dashboard-service";
import { dashboardKeys } from "./query-keys";

/** Auto-refresh setiap 1 menit agar data dashboard tetap segar */
const DASHBOARD_STALE_TIME = 1000 * 60; // 1 menit
const DASHBOARD_REFETCH_INTERVAL = 1000 * 60; // 1 menit

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
};

export const useSalesChart = () => {
  return useQuery({
    queryKey: dashboardKeys.chart(),
    queryFn: getSalesChartData,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
};

export const useRecentOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.recentOrders(),
    queryFn: getRecentOrders,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
};

export const useTopSellingProducts = () => {
  return useQuery({
    queryKey: dashboardKeys.topProducts(),
    queryFn: getTopSellingProducts,
    staleTime: DASHBOARD_STALE_TIME,
    refetchInterval: DASHBOARD_REFETCH_INTERVAL,
  });
};
