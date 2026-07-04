import { Order } from "../actions";

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Internal helper to send a WhatsApp message using Meta API, falling back to Twilio if Meta is unconfigured.
 */
async function sendWhatsAppViaGateway(
  to: string,
  messageText: string
): Promise<WhatsAppSendResult> {
  const metaToken = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const metaPhoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const hasMeta = metaToken && metaPhoneId && !metaToken.startsWith("your_");

  // Clean phone number: remove non-digits
  const cleanPhone = to.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  // 1. Try Meta WhatsApp API
  if (hasMeta) {
    try {
      const url = `https://graph.facebook.com/v18.0/${metaPhoneId}/messages`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${metaToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: formattedPhone,
          type: "text",
          text: {
            preview_url: true,
            body: messageText,
          },
        }),
      });

      const data = await response.json();
      if (response.ok && data.messages && data.messages.length > 0) {
        console.log(`[META WHATSAPP SUCCESS] Message sent to +${formattedPhone}. Message ID: ${data.messages[0].id}`);
        return {
          success: true,
          messageId: data.messages[0].id,
          simulated: false,
        };
      } else {
        const errorMsg = data.error?.message || "Unknown Meta WhatsApp API Error";
        console.error(`[META WHATSAPP API ERROR] Failed to send:`, data.error);
        return {
          success: false,
          error: errorMsg,
        };
      }
    } catch (err: any) {
      console.error(`[META WHATSAPP CONNECTION FAILURE] Error connecting to Meta API:`, err);
      return {
        success: false,
        error: err.message || "Failed to connect to Meta WhatsApp API service",
      };
    }
  }

  // 2. Fallback to Twilio WhatsApp API
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const hasTwilio = twilioSid && twilioToken && !twilioSid.startsWith("ACXXXXXX") && !twilioSid.includes("ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") && !twilioToken.includes("your_auth_token");

  if (hasTwilio) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

      const params = new URLSearchParams();
      params.append("To", `whatsapp:+${formattedPhone}`);
      params.append("From", twilioFrom.startsWith("whatsapp:") ? twilioFrom : `whatsapp:${twilioFrom}`);
      params.append("Body", messageText);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[TWILIO WHATSAPP SUCCESS] Message sent successfully via Twilio to +${formattedPhone}. SID: ${data.sid}`);
        return {
          success: true,
          messageId: data.sid,
          simulated: false,
        };
      } else {
        console.error(`[TWILIO WHATSAPP API ERROR] Failed to send: ${data.message}`);
        return {
          success: false,
          error: data.message,
        };
      }
    } catch (err: any) {
      console.error(`[TWILIO WHATSAPP CONNECTION FAILURE] Error connecting to Twilio API:`, err);
      return {
        success: false,
        error: err.message || "Failed to connect to Twilio API service",
      };
    }
  }

  // 3. Fallback to Simulator console logs
  console.log(`\n======================================================================`);
  console.log(`[WHATSAPP SIMULATOR] Dispatching WhatsApp message to +${formattedPhone}`);
  console.log(`Message Content:\n${messageText}`);
  console.log(`======================================================================\n`);

  return {
    success: true,
    messageId: `sim_meta_${Date.now()}`,
    simulated: true,
  };
}

/**
 * Sends a receipt notification directly to the customer's WhatsApp via unified gateway.
 */
export async function sendWhatsAppReceipt(
  order: Order,
  customerPhone: string
): Promise<WhatsAppSendResult> {
  const host = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const receiptUrl = `${protocol}://${host}/receipt/${order.receiptNumber}`;

  const itemsText = order.items
    .map((item) => `• ${item.name} x ${item.quantity} (₹${item.price * item.quantity})`)
    .join("\n");

  const messageText = `*Kohinoor Facilities - Order Receipt* 🧾

Dear *${order.customerName}*,

Thank you for your order! Your payment has been successfully received.

*Order Details:*
• *Receipt Number:* ${order.receiptNumber}
• *Order ID:* ${order.orderId}
• *Service Category:* ${order.serviceType}
• *Total Paid:* ₹${order.amount}

*Items:*
${itemsText}

*Secure Online Receipt:*
🔗 View receipt details and download your PDF: ${receiptUrl}

---
_Thank you for choosing Kohinoor Facilities._`;

  return sendWhatsAppViaGateway(customerPhone, messageText);
}

/**
 * Sends a custom WhatsApp message/notification to a designated phone number.
 */
export async function sendWhatsAppMessage(
  phone: string,
  messageText: string
): Promise<WhatsAppSendResult> {
  return sendWhatsAppViaGateway(phone, messageText);
}
