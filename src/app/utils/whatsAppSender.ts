import { Order } from "../actions";

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Sends a receipt notification directly to the customer's WhatsApp via Meta Cloud API.
 * Falls back to simulated console logs if API credentials are not provided in .env.local.
 */
export async function sendWhatsAppReceipt(
  order: Order,
  customerPhone: string
): Promise<WhatsAppSendResult> {
  const token = process.env.META_WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  // Clean customer phone number: remove non-digits
  const cleanPhone = customerPhone.replace(/[^0-9]/g, "");
  // Prepend country code 91 if it's a standard 10-digit Indian number
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  // Generate Receipt URL
  // We'll generate a public link to the online receipt verification/view portal
  const host = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const receiptUrl = `${protocol}://${host}/receipt/${order.receiptNumber}`;

  // Build the message text
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

  // Check if API credentials are missing or placeholder
  if (!token || !phoneId || token.startsWith("your_")) {
    console.log(`\n======================================================================`);
    console.log(`[META WHATSAPP SIMULATOR] Dispatching direct WhatsApp receipt to +${formattedPhone}`);
    console.log(`Message Content:\n${messageText}`);
    console.log(`======================================================================\n`);

    return {
      success: true,
      messageId: `sim_meta_${Date.now()}`,
      simulated: true,
    };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
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
      console.log(`[META WHATSAPP SUCCESS] Direct WhatsApp receipt sent to +${formattedPhone}. Message ID: ${data.messages[0].id}`);
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
  } catch (err) {
    const error = err as Error;
    console.error(`[META WHATSAPP CONNECTION FAILURE] Error connecting to Meta API:`, error);
    return {
      success: false,
      error: error.message || "Failed to connect to Meta WhatsApp API service",
    };
  }
}
