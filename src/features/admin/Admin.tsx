import { useProfile } from "@/features/auth/hooks/use-auth";
import {
  useDashboardStats,
  useRecentOrders,
  useSalesChart,
  useTopSellingProducts,
} from "./hook/use-dashboard-stats";
import { convertIDR } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, Users, Utensils, Trophy } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { RecentOrder } from "./services/dashboard-service";

const AdminPage = () => {
  const { data: profile } = useProfile();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: chartData, isLoading: chartLoading } = useSalesChart();
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders();
  const { data: topProducts, isLoading: topProductsLoading } =
    useTopSellingProducts();
  const navigate = useNavigate();

  if (profile?.role !== "admin") {
    return <Navigate to="/order" replace />;
  }

  const handleDetailOrder = (order: RecentOrder) => {
    const isSettled = ["settled"].includes(order.status);

    if (isSettled) {
      navigate(`/order/${order.order_id}`);
    } else {
      navigate(`/order/${order.order_id}/add`);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {profile?.name}. Berikut ringkasan hari ini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {convertIDR(stats?.totalRevenue || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            )}
            <p className="text-xs text-muted-foreground">Transaksi hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meja Terisi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.occupiedTables} Meja
              </div>
            )}
            <p className="text-xs text-muted-foreground">Okupansi saat ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Aktif</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalMenus} Item</div>
            )}
            <p className="text-xs text-muted-foreground">Total di database</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle>Menu Terlaris</CardTitle>
          </div>
          <CardDescription>
            Produk dengan jumlah penjualan terbanyak.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {topProductsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                </div>
              ))
            ) : topProducts?.length === 0 ? (
              <p className="text-sm text-muted-foreground col-span-full text-center py-4">
                Belum ada data penjualan.
              </p>
            ) : (
              topProducts?.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-lg border">
                    <AvatarImage
                      src={product.image_url || ""}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg">
                      <Utensils className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.total_quantity} Terjual
                    </span>
                    <span className="text-xs font-medium text-primary">
                      {convertIDR(product.revenue)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* 2. Grafik Penjualan (60%) */}
        <Card className="flex-1 lg:max-w-[60%]">
          <CardHeader>
            <CardTitle>Grafik Penjualan</CardTitle>
            <CardDescription>7 hari terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {chartLoading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp ${value / 1000}rb`}
                  />
                  <Tooltip
                    formatter={(value?: ValueType) => [
                      convertIDR(Number(value || 0)),
                      "Pendapatan",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 lg:max-w-[40%]">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>5 pesanan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {ordersLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="ml-4 space-y-1">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                      <Skeleton className="ml-auto h-4 w-[60px]" />
                    </div>
                  ))
                : recentOrders?.map((order) => (
                    <div key={order.id} className="flex items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {order.customer_name}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {order.order_id} •{" "}
                          <span className="capitalize">{order.status}</span>
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-sm">
                        <Button
                          onClick={() => handleDetailOrder(order)}
                          variant="outline"
                          size="sm"
                        >
                          Detail
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
