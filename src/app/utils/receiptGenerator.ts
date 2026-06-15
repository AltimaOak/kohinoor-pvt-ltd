import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Order } from "../actions";

/**
 * Generates a professional PDF receipt in memory and returns it as a Buffer.
 * Embeds a QR Code containing the Order ID.
 * 
 * @param order The Order object
 * @returns Promise resolving to a PDF Buffer
 */
export async function generateReceiptPdfBuffer(order: Order): Promise<Buffer> {
  // Generate QR Code containing the Order ID
  let qrCodeBuffer: Buffer;
  try {
    qrCodeBuffer = await QRCode.toBuffer(order.orderId, {
      margin: 1,
      width: 80,
      color: {
        dark: "#0f172a", // Dark navy color for QR module
        light: "#ffffff"
      }
    });
  } catch (qrErr) {
    console.error("[QR GENERATION ERROR] Failed to generate QR code:", qrErr);
    qrCodeBuffer = Buffer.from("");
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const chunks: Buffer[] = [];
      
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));
      
      // 1. Top Header Section (Dark Banner matching Kohinoor premium theme)
      doc.rect(0, 0, 595, 105).fill("#0f172a");
      
      // Kohinoor Branding
      doc.fillColor("#ffffff")
         .fontSize(20)
         .font("Helvetica-Bold")
         .text("KOHINOOR CITY OFFICE TOWERS", 50, 30);
         
      doc.fontSize(9)
         .font("Helvetica")
         .text("Tower B, Level 18, complex Estate & Premises Co-op Society Ltd", 50, 60);

      doc.fillColor("#38bdf8") // Sky-400 accent for subtitle
         .fontSize(9)
         .font("Helvetica-Bold")
         .text("KOHINOOR FACILITY HUB SERVICES - " + order.serviceType.toUpperCase() + " SERVICE", 50, 75);
      
      // 2. Title & QR Code
      doc.fillColor("#0f172a")
         .fontSize(16)
         .font("Helvetica-Bold")
         .text("OFFICIAL PAYMENT RECEIPT", 50, 135);
         
      // Embed QR code at top right
      if (qrCodeBuffer.length > 0) {
        doc.image(qrCodeBuffer, 465, 120, { width: 80 });
        doc.fontSize(7)
           .fillColor("#64748b")
           .font("Helvetica")
           .text("Scan for Order Info", 465, 203, { width: 80, align: "center" });
      }
         
      // Divider
      doc.moveTo(50, 215)
         .lineTo(545, 215)
         .strokeColor("#e2e8f0")
         .lineWidth(1)
         .stroke();
         
      // 3. Information Section
      let currentY = 230;
      
      // Table Titles
      doc.fillColor("#64748b").fontSize(8).font("Helvetica-Bold").text("RECEIPT DETAILS", 50, currentY);
      doc.text("CUSTOMER DETAILS", 320, currentY);
      
      currentY += 15;
      doc.fillColor("#0f172a").fontSize(9).font("Helvetica");
      
      // Metadata (Left Side)
      doc.text(`Receipt Number:`, 50, currentY);
      doc.font("Helvetica-Bold").text(`${order.receiptNumber}`, 140, currentY);
      
      // Customer Info (Right Side)
      doc.font("Helvetica").text(`Customer Name:`, 320, currentY);
      doc.font("Helvetica-Bold").text(`${order.customerName}`, 410, currentY);
      
      currentY += 16;
      doc.font("Helvetica").text(`Date & Time:`, 50, currentY);
      doc.text(`${new Date(order.createdAt).toLocaleString("en-IN")}`, 140, currentY);
      
      doc.text(`Phone Number:`, 320, currentY);
      doc.text(`+91 ${order.customerPhone}`, 410, currentY);
      
      currentY += 16;
      doc.text(`Service Type:`, 50, currentY);
      doc.font("Helvetica-Bold").text(`${order.serviceType} Services`, 140, currentY);
      
      doc.font("Helvetica").text(`Email Address:`, 320, currentY);
      doc.font("Helvetica-Bold").text(`${order.customerEmail || "N/A"}`, 410, currentY, { width: 135, lineBreak: false });
      
      currentY += 16;
      doc.font("Helvetica").text(`Payment Status:`, 50, currentY);
      doc.font("Helvetica-Bold").fillColor("#16a34a").text(`${order.paymentStatus.toUpperCase()}`, 140, currentY);
      
      doc.fillColor("#0f172a").font("Helvetica").text(`Order Reference:`, 320, currentY);
      doc.font("Helvetica-Oblique").text(`${order.orderId}`, 410, currentY);
      
      currentY += 16;
      doc.fillColor("#0f172a").font("Helvetica").text(`Payment Method:`, 50, currentY);
      doc.text(`${(order as any).paymentMethod || "Card / Online"}`, 140, currentY);

      doc.text(`Transaction ID:`, 320, currentY);
      doc.font("Helvetica-Bold").text(`${order.transactionId}`, 410, currentY);
      
      currentY += 25;
      
      // Divider
      doc.moveTo(50, currentY)
         .lineTo(545, currentY)
         .strokeColor("#e2e8f0")
         .lineWidth(1)
         .stroke();
         
      currentY += 15;
      
      // 4. Items Ordered Header
      doc.fillColor("#64748b").fontSize(9).font("Helvetica-Bold").text("ITEMS ORDERED", 50, currentY);
      
      currentY += 20;
      doc.fillColor("#475569").fontSize(9).font("Helvetica-Bold");
      doc.text("Description", 50, currentY);
      doc.text("Qty", 320, currentY, { width: 50, align: "center" });
      doc.text("Unit Price", 390, currentY, { width: 70, align: "right" });
      doc.text("Amount", 475, currentY, { width: 70, align: "right" });
      
      currentY += 15;
      doc.moveTo(50, currentY)
         .lineTo(545, currentY)
         .strokeColor("#e2e8f0")
         .lineWidth(1)
         .stroke();
         
      currentY += 10;
      doc.font("Helvetica").fontSize(10).fillColor("#0f172a");
      
      for (const item of order.items) {
        doc.font("Helvetica-Bold").text(item.name, 50, currentY, { width: 250 });
        doc.font("Helvetica").text(String(item.quantity), 320, currentY, { width: 50, align: "center" });
        doc.text(`₹${item.price}`, 390, currentY, { width: 70, align: "right" });
        doc.font("Helvetica-Bold").text(`₹${item.price * item.quantity}`, 475, currentY, { width: 70, align: "right" });
        
        currentY += 18;
      }
      
      currentY += 10;
      doc.moveTo(50, currentY)
         .lineTo(545, currentY)
         .strokeColor("#cbd5e1")
         .lineWidth(0.5)
         .stroke();
         
      currentY += 15;
      
      // Summary Card
      doc.rect(320, currentY - 5, 225, 40).fill("#f8fafc");
      doc.fillColor("#0f172a").fontSize(11).font("Helvetica-Bold");
      doc.text("Total Paid Amount:", 335, currentY);
      doc.fillColor("#0f172a").text(`₹${order.amount}`, 465, currentY, { width: 70, align: "right" });
      
      currentY += 65;
      
      // Footer info
      doc.fillColor("#64748b")
         .fontSize(9)
         .font("Helvetica-Bold")
         .text("Thank you for choosing Kohinoor Facilities.", 50, currentY, { align: "center" });
         
      currentY += 15;
      doc.font("Helvetica")
         .fontSize(8)
         .text("This is a computer-generated receipt.", 50, currentY, { align: "center" });
         
      currentY += 12;
      doc.fontSize(7.5)
         .fillColor("#94a3b8")
         .text("This is an automatically generated electronic invoice issued under Kohinoor Co-op Society premises guidelines. No signature required.", 50, currentY, { align: "center" });
      
      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
