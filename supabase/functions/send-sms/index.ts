import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// In production, these should be set as Supabase Secrets
// supabase secrets set --env-file .env
const CELCOM_API_KEY = Deno.env.get("CELCOM_API_KEY") || "8bbe9096bd0a795a0ca63decf3221602";
const CELCOM_PARTNER_ID = Deno.env.get("CELCOM_PARTNER_ID") || "1109";
const CELCOM_SHORTCODE = Deno.env.get("CELCOM_SHORTCODE") || "TUMAFUNDICO";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        },
      });
    }

    const { phone, message, user_id } = await req.json();

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "Phone and message are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Format phone number to include country code if missing (default to Kenya +254)
    const formattedPhone = phone.startsWith("+") ? phone : phone.startsWith("254") ? `+${phone}` : `+254${phone}`;

    // 1. Log the SMS attempt as 'queued' or 'sent'
    const { data: log, error: logError } = await supabase
      .from("sms_logs")
      .insert({
        user_id: user_id || null,
        phone: formattedPhone,
        message: message,
        status: "sent",
        gateway: "celcom_africa",
      })
      .select()
      .single();

    if (logError) {
      console.error("Failed to log SMS:", logError);
    }

    // 2. Call Celcom Africa API
    const response = await fetch("https://isms.celcomafrica.com/api/services/sendsms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apikey: CELCOM_API_KEY,
        partnerID: CELCOM_PARTNER_ID,
        shortcode: CELCOM_SHORTCODE,
        mobile: formattedPhone.replace("+", ""), // Celcom usually expects numbers without '+'
        message: message,
      }),
    });

    const result = await response.json();

    if (response.ok && log) {
      // Update log status to delivered based on API response
      await supabase
        .from("sms_logs")
        .update({ status: "delivered" })
        .eq("id", log.id);

      return new Response(
        JSON.stringify({ success: true, data: result, log_id: log.id }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } else {
      if (log) {
        await supabase
          .from("sms_logs")
          .update({ status: "failed" })
          .eq("id", log.id);
      }

      return new Response(
        JSON.stringify({ error: "Failed to send SMS", details: result }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
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
