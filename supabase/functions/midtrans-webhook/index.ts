/// <reference border="deno" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// ── CORS Headers ──────────────────────────────────────────────────────
// Dibutuhkan agar Supabase Edge Function dapat menerima request dari
// server eksternal (Midtrans) maupun preflight browser.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req) => {
  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    console.log("[midtrans-webhook] Received notification:", {
      order_id: body.order_id,
      transaction_status: body.transaction_status,
      status_code: body.status_code,
      gross_amount: body.gross_amount,
    });

    // ── 1. Validasi Signature Key ─────────────────────────────────────
    // Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");

    if (!serverKey) {
      console.error("[midtrans-webhook] MIDTRANS_SERVER_KEY is not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload =
      body.order_id + body.status_code + body.gross_amount + serverKey;

    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(payload),
    );
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    console.log("[midtrans-webhook] Signature match:", signature === body.signature_key);

    if (signature !== body.signature_key) {
      console.error("[midtrans-webhook] Invalid signature. Expected:", signature, "Got:", body.signature_key);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 2. Ekstrak real order_id ──────────────────────────────────────
    // Di create-payment, order_id dikirim ke Midtrans dengan suffix timestamp:
    // format: "<order_id>-<timestamp>" → contoh: "INV-1234567890-1746200000000"
    const orderIdWithTimestamp = body.order_id;
    const lastHyphenIndex = orderIdWithTimestamp.lastIndexOf("-");
    const rawOrderId =
      lastHyphenIndex !== -1
        ? orderIdWithTimestamp.substring(0, lastHyphenIndex)
        : orderIdWithTimestamp;

    console.log("[midtrans-webhook] Extracted rawOrderId:", rawOrderId, "from:", orderIdWithTimestamp);

    // ── 3. Tentukan status baru berdasarkan Midtrans transaction_status ──
    let newStatus = "";
    const txStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    if (
      txStatus === "settlement" ||
      (txStatus === "capture" && fraudStatus === "accept")
    ) {
      newStatus = "settled";
    } else if (txStatus === "pending") {
      newStatus = "process";
    } else if (
      txStatus === "deny" ||
      txStatus === "expire" ||
      txStatus === "cancel"
    ) {
      newStatus = "canceled";
    }

    console.log("[midtrans-webhook] Mapped transaction_status:", txStatus, "→ newStatus:", newStatus || "(no update)");

    // ── 4. Update DB ──────────────────────────────────────────────────
    if (newStatus) {
      const { data: order, error: updateError } = await supabaseClient
        .from("orders")
        .update({ status: newStatus })
        .eq("order_id", rawOrderId)
        .select("id, table_id")
        .single();

      if (updateError) {
        console.error("[midtrans-webhook] Failed to update order status:", updateError.message);
        throw new Error(`DB update failed: ${updateError.message}`);
      }

      console.log("[midtrans-webhook] Order updated successfully:", { id: order?.id, newStatus });

      // Jika settled dan ada meja, bebaskan meja
      if (newStatus === "settled" && order?.table_id) {
        const { error: tableError } = await supabaseClient
          .from("tables")
          .update({ status: "available" })
          .eq("id", order.table_id);

        if (tableError) {
          // Non-fatal: log error tapi tetap return success agar Midtrans tidak retry
          console.error("[midtrans-webhook] Failed to release table:", tableError.message);
        } else {
          console.log("[midtrans-webhook] Table released:", order.table_id);
        }
      }
    }

    return new Response(
      JSON.stringify({ status: "ok" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[midtrans-webhook] Unhandled error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
