import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { convertIDR } from "@/lib/utils";
import type { ChartData } from "../services/dashboard-service";

interface SalesChartProps {
  data: ChartData[] | undefined;
  isLoading: boolean;
}

export const SalesChart = ({ data, isLoading }: SalesChartProps) => {
  return (
    <Card className="flex-1 lg:max-w-[60%]">
      <CardHeader>
        <CardTitle>Grafik Penjualan</CardTitle>
        <CardDescription>7 hari terakhir.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
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
  );
};
