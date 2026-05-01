import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RecentOrder } from "../services/dashboard-service";

interface RecentOrdersProps {
  orders: RecentOrder[] | undefined;
  isLoading: boolean;
}

/** Translasi status order dari bahasa Inggris ke Bahasa Indonesia */
const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  active: "Aktif",
  paid: "Dibayar",
  settled: "Selesai",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const translateStatus = (status: string): string =>
  STATUS_LABELS[status] ?? status;

export const RecentOrders = ({ orders, isLoading }: RecentOrdersProps) => {
  const navigate = useNavigate();

  const handleDetailOrder = (order: RecentOrder) => {
    const isSettled = order.status === "settled";
    if (isSettled) {
      navigate(`/order/${order.order_id}`);
    } else {
      navigate(`/order/${order.order_id}/add`);
    }
  };

  return (
    <Card className="flex-1 lg:max-w-[40%]">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>5 pesanan terakhir.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="ml-4 space-y-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <Skeleton className="ml-auto h-4 w-[60px]" />
              </div>
            ))
          ) : !orders || orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Belum ada pesanan hari ini.
            </p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
                  <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-4 space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {order.order_id} •{" "}
                    <span className="capitalize">
                      {translateStatus(order.status)}
                    </span>
                  </p>
                </div>
                <div className="ml-3 shrink-0">
                  <Button
                    onClick={() => handleDetailOrder(order)}
                    variant="outline"
                    size="sm"
                  >
                    Detail
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
