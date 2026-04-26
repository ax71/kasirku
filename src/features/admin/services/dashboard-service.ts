import supabase from "@/lib/supabase";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  occupiedTables: number;
  totalMenus: number;
}

export interface ChartData {
  day: string;
  revenue: number;
}

export interface RecentOrder {
  id: number;
  order_id: string;
  customer_name: string;
  status: string;
  created_at: string;
  total_nominal: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();

  const { data: revenueData, error: revenueError } = await supabase
    .from("orders")
    .select("id, orders_menus(nominal)")
    .gte("created_at", startOfDay)
    .in("status", ["paid", "settled", "completed"]);

  if (revenueError) throw new Error(revenueError.message);

  const totalRevenue =
    revenueData?.reduce((acc, order) => {
      const menus = order.orders_menus as unknown as
        | { nominal: number }[]
        | null;
      const orderTotal =
        menus?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;
      return acc + orderTotal;
    }, 0) || 0;

  const { count: totalOrders, error: ordersError } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay);

  if (ordersError) throw new Error(ordersError.message);

  const { count: occupiedTables, error: tablesError } = await supabase
    .from("tables")
    .select("*", { count: "exact", head: true })
    .eq("status", "occupied");

  if (tablesError) throw new Error(tablesError.message);

  const { count: totalMenus, error: menusError } = await supabase
    .from("menus")
    .select("*", { count: "exact", head: true });

  if (menusError) throw new Error(menusError.message);

  return {
    totalRevenue,
    totalOrders: totalOrders || 0,
    occupiedTables: occupiedTables || 0,
    totalMenus: totalMenus || 0,
  };
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_id, customer_name, status, created_at, orders_menus(nominal)",
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);

  return (data || []).map((order) => {
    const menus = order.orders_menus as unknown as { nominal: number }[] | null;
    const total_nominal =
      menus?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;

    return {
      id: order.id,
      order_id: order.order_id || "",
      customer_name: order.customer_name || "Guest",
      status: order.status || "unknown",
      created_at: order.created_at,
      total_nominal,
    };
  });
}

export interface TopProduct {
  id: number;
  name: string;
  total_quantity: number;
  revenue: number;
  image_url: string | null;
}

export async function getTopSellingProducts(): Promise<TopProduct[]> {
  // Ambil semua item menu dari order yang sudah dibayar
  const { data, error } = await supabase
    .from("orders_menus")
    .select("quantity, nominal, menu_id, menus(id, name, image_url), orders!inner(status)")
    .in("orders.status", ["paid", "settled", "completed"]);

  if (error) throw new Error(error.message);

  // Agregasi berdasarkan menu_id
  const aggregation: Record<number, TopProduct> = {};

  data?.forEach((item) => {
    const menu = item.menus as any;
    if (!menu) return;

    if (!aggregation[menu.id]) {
      aggregation[menu.id] = {
        id: menu.id,
        name: menu.name,
        total_quantity: 0,
        revenue: 0,
        image_url: menu.image_url,
      };
    }

    aggregation[menu.id].total_quantity += item.quantity || 0;
    aggregation[menu.id].revenue += item.nominal || 0;
  });

  // Sort berdasarkan quantity terbanyak dan ambil 5 teratas
  return Object.values(aggregation)
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5);
}

export async function getSalesChartData(): Promise<ChartData[]> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: orderData, error } = await supabase
    .from("orders")
    .select("created_at, orders_menus(nominal)")
    .gte("created_at", sevenDaysAgo.toISOString())
    .in("status", ["paid", "settled", "completed"]);

  if (error) throw new Error(error.message);

  const days: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
    days[dayName] = 0;
  }

  orderData?.forEach((order) => {
    const dayName = new Date(order.created_at).toLocaleDateString("id-ID", {
      weekday: "short",
    });
    const menus = order.orders_menus as unknown as { nominal: number }[] | null;
    const orderTotal =
      menus?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;

    if (days[dayName] !== undefined) {
      days[dayName] += orderTotal;
    }
  });

  return Object.entries(days).map(([day, revenue]) => ({ day, revenue }));
}
