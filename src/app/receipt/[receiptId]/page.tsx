import { getDb, checkAuth } from "@/app/actions";
import { notFound } from "next/navigation";
import { Check, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { hasReceiptAccess } from "@/app/utils/security";
import ReceiptPortalClient from "@/components/ReceiptPortalClient";
import PortalActions from "./PortalActions";

export const revalidate = 0; // Disable caching to fetch fresh DB values

export default async function ReceiptPortalPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const resolvedParams = await params;
  const receiptId = resolvedParams.receiptId;

  // 1. Fetch order from the database
  const db = await getDb();
  const order = db.orders?.find((o) => o.receiptNumber === receiptId);

  if (!order) {
    notFound();
  }

  // 2. Validate user access (Admin session or verified receipt cookie)
  const isAdmin = await checkAuth();
  const isAuthorized = isAdmin || (await hasReceiptAccess(receiptId));

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-4 w-full">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-600">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">
              Secure Receipt Verification
            </h1>
            <p className="text-xs text-slate-500 max-w-[280px]">
              To protect privacy, please verify your customer details to access receipt{" "}
              <span className="font-mono text-slate-900 font-bold">{receiptId}</span>.
            </p>
          </div>

          {/* Client-side form for typing phone/email */}
          <ReceiptPortalClient receiptId={receiptId} />

          <div className="text-center mt-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-600 hover:text-sky-700 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Render the dynamic receipt details
  const dateFormatted = new Date(order.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-xl p-8 print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center border-b border-dashed border-slate-200 pb-6 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Kohinoor Logo" className="h-full w-full object-contain p-2" />
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight font-display">
            Kohinoor Facilities
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Tower B, Level 18, complex Estate & Premises Co-op Society Ltd
          </p>
          <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            Payment {order.paymentStatus}
          </span>
        </div>

        {/* Invoice Metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-2xl print:bg-slate-100">
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Receipt Number
            </span>
            <span className="font-mono font-bold text-slate-900">{order.receiptNumber}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Date & Time
            </span>
            <span className="font-bold text-slate-900">{dateFormatted}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Customer Name
            </span>
            <span className="font-bold text-slate-900">{order.customerName}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Mobile Number
            </span>
            <span className="font-mono font-bold text-slate-900">+91 {order.customerPhone}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Service Category
            </span>
            <span className="font-bold text-slate-900">{order.serviceType} Services</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Transaction ID
            </span>
            <span className="font-mono font-bold text-slate-900 truncate block max-w-[150px]" title={order.transactionId}>
              {order.transactionId}
            </span>
          </div>
        </div>

        {/* Invoice Line Items */}
        <div className="mb-6">
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
            Order Details
          </span>
          <div className="flex flex-col gap-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs text-slate-700">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-950">{item.name}</span>
                  <span className="text-[10px] text-slate-400">₹{item.price} per unit</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="font-medium text-slate-500">Qty: {item.quantity}</span>
                  <span className="font-extrabold text-slate-950 font-mono">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-slate-200 my-4" />

        {/* Invoice Total */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Total Amount Paid
          </span>
          <span className="text-2xl font-black text-slate-900 font-mono">₹{order.amount}</span>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 leading-normal border-t border-dashed border-slate-200 pt-6">
          <p className="font-bold text-slate-500">Thank you for choosing Kohinoor Facilities.</p>
          <p className="mt-1">This is a computer-generated receipt.</p>
        </div>

      </div>

      {/* Action Buttons (Download, Print, Resend Email) */}
      <PortalActions receiptId={order.receiptNumber} />

    </div>
  );
}
