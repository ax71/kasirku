/// <reference border="deno" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req) => {
  try {
    const body = await req.json();

    // 1. Validasi Signature Key (Keamanan)
    // Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");
    const payload =
      body.order_id + body.status_code + body.gross_amount + serverKey;

    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(payload),
    );
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== body.signature_key) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
      });
    }

    // 2. Ekstrak real order_id (karena di create-payment kita tambahkan timestamp)
    const realOrderId = body.order_id.split("-INV-")[0].split("-")[0]; // Sesuaikan dengan format generator Anda
    // Atau lebih aman, cari berdasarkan order_id yang mirip di database
    const rawOrderId =
      body.order_id.split("-")[0] + "-" + body.order_id.split("-")[1]; // INV-xxxx

    // 3. Update status berdasarkan Midtrans status
    let newStatus = "";
    if (
      body.transaction_status === "settlement" ||
      body.transaction_status === "capture"
    ) {
      newStatus = "settled";
    } else if (body.transaction_status === "pending") {
      newStatus = "process";
    } else if (
      body.transaction_status === "deny" ||
      body.transaction_status === "expire" ||
      body.transaction_status === "cancel"
    ) {
      newStatus = "canceled";
    }

    if (newStatus) {
      const { data: order } = await supabaseClient
        .from("orders")
        .update({ status: newStatus })
        .eq("order_id", rawOrderId)
        .select("table_id")
        .single();

      // Jika settled dan ada meja, bebaskan meja
      if (newStatus === "settled" && order?.table_id) {
        await supabaseClient
          .from("tables")
          .update({ status: "available" })
          .eq("id", order.table_id);
      }
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
});
