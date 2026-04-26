import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentOrders,
  getSalesChartData,
  getTopSellingProducts,
} from "../services/dashboard-service";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });
};

export const useSalesChart = () => {
  return useQuery({
    queryKey: ["sales-chart"],
    queryFn: getSalesChartData,
  });
};

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: getRecentOrders,
  });
};

export const useTopSellingProducts = () => {
  return useQuery({
    queryKey: ["top-selling-products"],
    queryFn: getTopSellingProducts,
  });
};
