import { Navigate } from "react-router-dom";
import { useProfile } from "@/features/auth/hooks/use-auth";
import {
  useDashboardStats,
  useRecentOrders,
  useSalesChart,
  useTopSellingProducts,
} from "./hooks/use-dashboard-stats";
import { StatsCards } from "./components/stats-cards";
import { TopProducts } from "./components/top-products";
import { SalesChart } from "./components/sales-chart";
import { RecentOrders } from "./components/recent-orders";
import { AlertCircle } from "lucide-react";

const AdminPage = () => {
  const { data: profile } = useProfile();

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useDashboardStats();

  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
  } = useSalesChart();

  const {
    data: recentOrders,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useRecentOrders();

  const {
    data: topProducts,
    isLoading: topProductsLoading,
    isError: topProductsError,
  } = useTopSellingProducts();

  if (profile?.role !== "admin") {
    return <Navigate to="/order" replace />;
  }

  const hasError = statsError || chartError || ordersError || topProductsError;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {profile?.name}. Berikut ringkasan hari ini.
        </p>
      </div>
      {hasError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Gagal memuat sebagian data. Periksa koneksi Anda atau muat ulang
            halaman.
          </span>
        </div>
      )}
      <StatsCards stats={stats} isLoading={statsLoading} />
      <TopProducts products={topProducts} isLoading={topProductsLoading} />
      <div className="flex flex-col lg:flex-row gap-4">
        <SalesChart data={chartData} isLoading={chartLoading} />
        <RecentOrders orders={recentOrders} isLoading={ordersLoading} />
      </div>
    </div>
  );
};

export default AdminPage;
