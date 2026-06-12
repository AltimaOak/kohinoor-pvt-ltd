export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export function formatPhoneNumber(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  // Prepend country code 91 if phone is 10 digits
  return clean.length === 10 ? `91${clean}` : clean;
}

/**
 * Sends a PDF receipt document using the official WhatsApp Business Cloud API.
 * If credentials are not configured or placeholder, falls back to simulated console logging.
 */
export async function sendWhatsAppDocumentMessage(
  customerName: string,
  orderId: string,
  receiptId: string,
  serviceType: "Nursery" | "Cafeteria",
  totalAmountPaid: number,
  customerPhone: string,
  pdfReceiptUrl: string
): Promise<WhatsAppSendResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const formattedTo = formatPhoneNumber(customerPhone);
  const filename = `Kohinoor_Receipt_${receiptId}.pdf`;
  
  const captionText = `Dear ${customerName},\n\n` +
    `Thank you for your order with Kohinoor Facilities.\n\n` +
    `Your order has been confirmed successfully.\n\n` +
    `• Service: ${serviceType}\n` +
    `• Order ID: ${orderId}\n` +
    `• Receipt Number: ${receiptId}\n` +
    `• Total Amount Paid: ₹${totalAmountPaid}\n\n` +
    `Your official PDF receipt is attached below.`;

  const payload = {
    messaging_product: "whatsapp",
    to: formattedTo,
    type: "document",
    document: {
      link: pdfReceiptUrl,
      filename: filename,
      caption: captionText
    }
  };

  // If credentials are empty, missing, or standard placeholder
  if (!accessToken || !phoneNumberId || accessToken === "your_access_token_here" || phoneNumberId === "your_phone_number_id_here") {
    console.log(`\n======================================================================`);
    console.log(`[WHATSAPP BUSINESS API SIMULATION] (Missing/Placeholder Credentials)`);
    console.log(`To: +${formattedTo}`);
    console.log(`Payload:`, JSON.stringify(payload, null, 2));
    console.log(`======================================================================\n`);
    
    // Return mock success with simulated WhatsApp message ID
    return {
      success: true,
      messageId: `wamid.HBgMOTE4NjU3OTAyODA5FQIAERgSRDMxMjNBNzc1OEYwQjQxNjQyNQA=`
    };
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok && data.messages && data.messages.length > 0) {
      console.log(`[WHATSAPP SUCCESS] Official document message sent to +${formattedTo}. Message ID: ${data.messages[0].id}`);
      return { success: true, messageId: data.messages[0].id };
    } else {
      const errorMsg = data.error?.message || "Unknown WhatsApp API error";
      console.error(`[WHATSAPP FAILURE] Official document message failed: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  } catch (err: any) {
    console.error(`[WHATSAPP CONNECTION ERROR] Failed to connect to WhatsApp API:`, err);
    return { success: false, error: err.message || "Network connection error" };
  }
}
