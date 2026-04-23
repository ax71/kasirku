/// <reference border="deno" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { order_id, baseUrl: requestBaseUrl } = await req.json();

    // 1. Ambil data order
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("*, tables(name)")
      .eq("order_id", order_id)
      .single();

    if (orderError || !order) throw new Error("Order not found");

    // 2. Hitung Grand Total
    const { data: items } = await supabaseClient
      .from("orders_menus")
      .select("*, menus(name)")
      .eq("order_id", order.id);

    const subtotal = items?.reduce((acc: number, item: any) => acc + item.nominal, 0) || 0;
    const tax = Math.round(subtotal * 0.12);
    const service = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + tax + service;

    // 3. Konfigurasi Midtrans & URL Redirect
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    const isProduction = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
    const midtransUrl = isProduction 
      ? "https://app.midtrans.com/snap/v1/transactions" 
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    // Gunakan baseUrl dari request (frontend) agar redirect kembali ke project yang memanggil
    const baseUrl = requestBaseUrl || "http://localhost:5173"; 

    const authBase64 = btoa(`${serverKey}:`);

    const midtransResponse = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Basic ${authBase64}`,
      },
      body: JSON.stringify({
        transaction_details: {
          // Tambahkan suffix timestamp agar ID selalu unik bagi Midtrans
          order_id: `${order_id}-${Date.now()}`, 
          gross_amount: grandTotal,
        },
        item_details: [
          ...(items?.map((item: any) => ({
            id: item.menu_id,
            price: Math.round(item.nominal / item.quantity),
            quantity: item.quantity,
            name: item.menus?.name || "Menu Item",
          })) || []),
          { id: "tax", price: tax, quantity: 1, name: "Tax (12%)" },
          { id: "service", price: service, quantity: 1, name: "Service (5%)" },
        ],
        customer_details: {
          first_name: order.customer_name,
        },
        callbacks: {
          finish: `${baseUrl}/admin/order/payment-status?status=success&order_id=${order_id}`,
          error: `${baseUrl}/admin/order/payment-status?status=error&order_id=${order_id}`,
          pending: `${baseUrl}/admin/order/payment-status?status=pending&order_id=${order_id}`
        },
        custom_field1: order.id 
      }),
    });

    const midtransData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      throw new Error(midtransData.error_messages?.join(", ") || "Midtrans error");
    }

    // 4. Simpan payment_token ke database
    await supabaseClient
      .from("orders")
      .update({ payment_token: midtransData.token })
      .eq("id", order.id);

    return new Response(JSON.stringify(midtransData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});