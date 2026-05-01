import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, Users, Utensils } from "lucide-react";
import { convertIDR } from "@/lib/utils";
import type { DashboardStats } from "../services/dashboard-service";

interface StatsCardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  description: string;
  isLoading: boolean;
}

const StatCard = ({
  title,
  icon,
  value,
  description,
  isLoading,
}: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Pendapatan"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        value={convertIDR(stats?.totalRevenue || 0)}
        description="Hari ini"
        isLoading={isLoading}
      />
      <StatCard
        title="Pesanan"
        icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
        value={stats?.totalOrders}
        description="Transaksi hari ini"
        isLoading={isLoading}
      />
      <StatCard
        title="Meja Terisi"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        value={`${stats?.occupiedTables} Meja`}
        description="Okupansi saat ini"
        isLoading={isLoading}
      />
      <StatCard
        title="Menu Aktif"
        icon={<Utensils className="h-4 w-4 text-muted-foreground" />}
        value={`${stats?.totalMenus} Item`}
        description="Total di database"
        isLoading={isLoading}
      />
    </div>
  );
};
