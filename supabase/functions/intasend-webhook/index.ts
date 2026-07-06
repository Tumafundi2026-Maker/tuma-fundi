import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("INTASEND_WEBHOOK_SECRET") || "Otuoma2013@2026";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface IntaSendWebhookPayload {
  invoice_id: string;
  state: string;
  provider: string;
  net_amount: string;
  currency: string;
  value: string;
  api_ref?: string;
  challenge?: string;
  customer?: {
    name?: string;
    email?: string;
    phone_number?: string;
  };
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const payload: IntaSendWebhookPayload = await req.json();

    console.log("IntaSend webhook received:", JSON.stringify(payload));

    // --- SECURITY: Challenge verification ---
    if (!payload.challenge || payload.challenge !== WEBHOOK_SECRET) {
      console.error("Webhook challenge verification failed");
      return new Response(
        JSON.stringify({ error: "Unauthorized: invalid challenge" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // --- Validation ---
    if (!payload.invoice_id) {
      return new Response(
        JSON.stringify({ error: "Missing invoice_id" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // --- DEDUPLICATION: Check if already processed ---
    const { data: existingPayment, error: lookupError } = await supabase
      .from("intasend_payments")
      .select("id, status")
      .eq("invoice_id", payload.invoice_id)
      .maybeSingle();

    if (lookupError) {
      console.error("Lookup error:", lookupError);
      return new Response(
        JSON.stringify({ error: "Database lookup failed", details: lookupError.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // If already COMPLETE, skip processing (idempotent)
    if (existingPayment && existingPayment.status === "COMPLETE") {
      console.log(`Invoice ${payload.invoice_id} already COMPLETE, skipping`);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Already processed (duplicate webhook)",
          payment_id: existingPayment.id,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Map IntaSend state to our status
    const statusMap: Record<string, string> = {
      COMPLETE: "COMPLETE",
      PROCESSING: "PROCESSING",
      PENDING: "PENDING",
      FAILED: "FAILED",
    };

    const mappedStatus = statusMap[payload.state] || "PENDING";
    const amount = parseFloat(payload.net_amount) || parseFloat(payload.value) || 0;

    // --- UPSERT payment record ---
    const { data: payment, error: upsertError } = await supabase
      .from("intasend_payments")
      .upsert(
        {
          invoice_id: payload.invoice_id,
          booking_id: payload.api_ref || null,
          amount: amount,
          currency: payload.currency || "KES",
          status: mappedStatus,
          provider: payload.provider || null,
          customer_name: payload.customer?.name || null,
          customer_email: payload.customer?.email || null,
          customer_phone: payload.customer?.phone_number || null,
          api_ref: payload.api_ref || null,
          raw_payload: payload as unknown as Record<string, unknown>,
        },
        { onConflict: "invoice_id" }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      return new Response(
        JSON.stringify({ error: "Failed to save payment", details: upsertError.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // --- If payment is COMPLETE, update the booking status to 'confirmed' ---
    if (mappedStatus === "COMPLETE" && payload.api_ref) {
      const { error: bookingUpdateError } = await supabase
        .from("bookings")
        .update({ status: "accepted" })
        .eq("id", payload.api_ref)
        .neq("status", "completed"); // Don't revert completed bookings

      if (bookingUpdateError) {
        console.error("Booking update error:", bookingUpdateError);
        // Non-fatal: payment is recorded, booking update can be retried
      } else {
        console.log(`Booking ${payload.api_ref} marked as accepted after payment`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed successfully",
        payment_id: payment?.id,
        status: mappedStatus,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
