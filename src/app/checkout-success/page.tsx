import { getDb, checkAuth } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import { Check, CheckCircle2, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { hasReceiptAccess } from "@/app/utils/security";
import SuccessPageActions from "./SuccessPageActions";
import OrderStatusTracker from "@/components/OrderStatusTracker";

export const revalidate = 0; // Fresh database updates on checkout landing

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ receiptId?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const receiptId = resolvedSearchParams.receiptId;

  if (!receiptId) {
    redirect("/services");
  }

  // 1. Fetch order details from database
  const db = await getDb();
  const order = db.orders?.find((o) => o.receiptNumber === receiptId);

  if (!order) {
    notFound();
  }

  // 2. Security validation: Ensure user has valid cookies or is admin
  const isAdmin = await checkAuth();
  const isAuthorized = isAdmin || (await hasReceiptAccess(receiptId));

  if (!isAuthorized) {
    // Redirect unauthorized guesses directly to verify page of the portal
    redirect(`/receipt/${receiptId}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased py-16 px-4 relative overflow-hidden">
      {/* Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xl relative z-10 flex flex-col items-center">
        
        {/* Verification Checkmark Banner */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-sm mb-6">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
        </div>

        {/* Headings */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display mb-1.5 uppercase">
          Order Placement Successful!
        </h1>
        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
          Payment Verified
        </span>

        {/* Swiggy/Zomato Style Live Order Status Tracker */}
        <div className="w-full my-6">
          <OrderStatusTracker 
            receiptId={order.receiptNumber}
            serviceType={order.serviceType}
            initialStatus={order.orderStatus || "placed"}
          />
        </div>

        {/* Metadata Details Card */}
        <div className="w-full bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col gap-3 text-xs text-left mb-8 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans font-semibold">Receipt Number</span>
            <span className="font-bold text-slate-900 text-right">{order.receiptNumber}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200/60 pt-3">
            <span className="text-slate-500 font-sans font-semibold">Order Reference</span>
            <span className="text-slate-800 text-right truncate max-w-[180px]">{order.orderId}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200/60 pt-3 text-sm">
            <span className="text-slate-500 font-sans font-black">Amount Paid</span>
            <span className="font-black text-emerald-600">₹{order.amount}</span>
          </div>
        </div>

        {/* Dynamic Action Panel (Buttons for PDF, View, Print, Resend) */}
        <SuccessPageActions receiptId={order.receiptNumber} />

        <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-wider">
          <Link
            href="/services"
            className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 font-bold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Facility Hub</span>
          </Link>
          <Link
            href="/my-receipts"
            className="text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1.5 font-bold"
          >
            <span>Receipt History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
