import nodemailer from "nodemailer";
import { Order } from "../actions";

export interface EmailSendResult {
  success: boolean;
  error?: string;
  previewUrl?: string; // Preview URL for Ethereal test accounts
}

/**
 * Returns a nodemailer transporter configured via environment variables.
 * Falls back to an Ethereal Email test account if credentials are not provided.
 */
async function getTransporter(): Promise<nodemailer.Transporter> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true"; // true for 465, false for 587
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If we have custom SMTP env configuration
  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  // Fallback: Ethereal test SMTP server
  console.log("[SMTP CONFIG] SMTP credentials missing in .env.local. Initializing Ethereal test sandbox...");
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Sends a PDF receipt email to the exact email address provided during checkout.
 */
export async function sendReceiptEmail(
  order: Order,
  pdfBuffer: Buffer,
  customerEmail: string
): Promise<EmailSendResult> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    console.error(`[EMAIL ERROR] Invalid email address: ${customerEmail}`);
    return { success: false, error: "Invalid email format" };
  }

  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.SMTP_FROM || "Kohinoor Facilities <receipts@kohinoorfacilities.com>";
    const filename = `Kohinoor_Receipt_${order.receiptNumber}.pdf`;

    const mailOptions = {
      from: fromAddress,
      to: customerEmail,
      cc: ["devendra.sali@kohinoorcommercial2.in", "roshan.patil@kohinoorcommercial2.in"],
      subject: "Kohinoor Facilities - Order Receipt",
      text: `Dear ${order.customerName},

Thank you for your order.

Your payment has been successfully received.

Order ID:
${order.orderId}

Receipt Number:
${order.receiptNumber}

Service:
${order.serviceType}

Amount:
₹${order.amount}

Your official receipt is attached to this email.

You can also access your receipt online using the secure receipt portal.

Thank you for choosing Kohinoor Facilities.

Regards,
Kohinoor Facilities Team`,
      attachments: [
        {
          filename: filename,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] Email receipt sent successfully to ${customerEmail}. Message ID: ${info.messageId}`);

    // If using Ethereal sandbox, get the test preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    if (previewUrl) {
      console.log(`\n======================================================================`);
      console.log(`[EMAIL SANDBOX PREVIEW URL] View sent mail and PDF attachment here:`);
      console.log(`${previewUrl}`);
      console.log(`======================================================================\n`);
    }

    return {
      success: true,
      previewUrl
    };
  } catch (err: any) {
    console.error(`[EMAIL DISPATCH FAILURE] Failed to send receipt email to ${customerEmail}:`, err);
    return {
      success: false,
      error: err.message || "Failed to send receipt email via SMTP"
    };
  }
}
