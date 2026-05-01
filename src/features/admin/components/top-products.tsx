import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Utensils } from "lucide-react";
import type { TopProduct } from "../services/dashboard-service";

interface TopProductsProps {
  products: TopProduct[] | undefined;
  isLoading: boolean;
}

export const TopProducts = ({ products, isLoading }: TopProductsProps) => {
  return (
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[60px]" />
                </div>
              </div>
            ))
          ) : products?.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full text-center py-4">
              Belum ada data penjualan.
            </p>
          ) : (
            products?.map((product) => (
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
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
