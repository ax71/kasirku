import supabase from "@/lib/supabase";

// ── Interfaces ────────────────────────────────────────────────────────

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

export interface TopProduct {
  id: number;
  name: string;
  total_quantity: number;
  revenue: number;
  image_url: string | null;
}

// ── Internal join types (menggantikan `as any`) ────────────────────────

interface OrderMenuNominal {
  nominal: number;
}

interface MenuJoin {
  id: number;
  name: string;
  image_url: string | null;
}

// ── Service Functions ─────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();

  // Jalankan semua query secara paralel dengan Promise.all
  const [revenueResult, ordersResult, tablesResult, menusResult] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, orders_menus(nominal)")
        .gte("created_at", startOfDay)
        .in("status", ["paid", "settled", "completed"]) as unknown as Promise<{
          data: Array<{ id: number; orders_menus: Array<{ nominal: number }> }> | null;
          error: { message: string } | null;
        }>,

      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfDay) as unknown as Promise<{
          count: number | null;
          data: null;
          error: { message: string } | null;
        }>,

      supabase
        .from("tables")
        .select("*", { count: "exact", head: true })
        .eq("status", "occupied") as unknown as Promise<{
          count: number | null;
          data: null;
          error: { message: string } | null;
        }>,

      supabase
        .from("menus")
        .select("*", { count: "exact", head: true }) as unknown as Promise<{
          count: number | null;
          data: null;
          error: { message: string } | null;
        }>,
    ]);

  if (revenueResult.error) throw new Error(revenueResult.error.message);
  if (ordersResult.error) throw new Error(ordersResult.error.message);
  if (tablesResult.error) throw new Error(tablesResult.error.message);
  if (menusResult.error) throw new Error(menusResult.error.message);

  const totalRevenue =
    revenueResult.data?.reduce((acc, order) => {
      const menus = order.orders_menus as unknown as OrderMenuNominal[] | null;
      const orderTotal =
        menus?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;
      return acc + orderTotal;
    }, 0) || 0;

  return {
    totalRevenue,
    totalOrders: ordersResult.count || 0,
    occupiedTables: tablesResult.count || 0,
    totalMenus: menusResult.count || 0,
  };
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_id, customer_name, status, created_at, orders_menus(nominal)",
    )
    .order("created_at", { ascending: false })
    .limit(5) as unknown as {
    data: Array<{
      id: number;
      order_id: string;
      customer_name: string;
      status: string;
      created_at: string;
      orders_menus: Array<{ nominal: number }>;
    }> | null;
    error: { message: string } | null;
  };

  if (error) throw new Error(error.message);

  return (data || []).map((order) => {
    const menus = order.orders_menus as unknown as OrderMenuNominal[] | null;
    const total_nominal =
      menus?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;

    return {
      id: order.id,
      order_id: order.order_id || "",
      customer_name: order.customer_name,
      status: order.status,
      created_at: order.created_at,
      total_nominal,
    };
  });
}

export async function getTopSellingProducts(): Promise<TopProduct[]> {
  const { data, error } = await supabase
    .from("orders_menus")
    .select(
      "quantity, nominal, menu_id, menus(id, name, image_url), orders!inner(status)",
    )
    .in("orders.status", ["paid", "settled", "completed"]) as unknown as {
    data: Array<{
      quantity: number;
      nominal: number;
      menu_id: number;
      menus: MenuJoin | null;
    }> | null;
    error: { message: string } | null;
  };

  if (error) throw new Error(error.message);

  const aggregation: Record<number, TopProduct> = {};

  data?.forEach((item) => {
    const menu = item.menus as MenuJoin | null;
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
    .in("status", ["paid", "settled", "completed"]) as unknown as {
    data: Array<{
      created_at: string;
      orders_menus: Array<{ nominal: number }>;
    }> | null;
    error: { message: string } | null;
  };

  if (error) throw new Error(error.message);

  // Gunakan format date lokal YYYY-MM-DD agar konsisten dengan hari yang ditampilkan
  const days: Record<string, { label: string; revenue: number }> = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);
    
    // Format YYYY-MM-DD secara manual dari local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const localKey = `${year}-${month}-${day}`;
    
    const label = date.toLocaleDateString("id-ID", { weekday: "short" });
    days[localKey] = { label, revenue: 0 };
  }

  orderData?.forEach((order) => {
    const d = new Date(order.created_at);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const localKey = `${year}-${month}-${day}`;

    if (days[localKey] !== undefined) {
      const menus = order.orders_menus as unknown as OrderMenuNominal[] | null;
      const orderTotal =
        menus?.reduce((sum, item) => sum + (item.nominal || 0), 0) || 0;
      days[localKey].revenue += orderTotal;
    }
  });

  // Map ke format output, gunakan label hari sebagai tampilan
  return Object.values(days).map(({ label, revenue }) => ({
    day: label,
    revenue,
  }));
}
