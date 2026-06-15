import { getDb, checkAuth } from "@/app/actions";
import { notFound, redirect } from "next/navigation";
import { Check, CheckCircle2, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { hasReceiptAccess } from "@/app/utils/security";
import SuccessPageActions from "./SuccessPageActions";

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a,transparent_60%)] bg-slate-950 flex flex-col items-center justify-center font-sans antialiased py-16 px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-lg bg-slate-900/20 border border-slate-800 rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md flex flex-col items-center">
        
        {/* Verification Checkmark Banner */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5 mb-6 animate-pulse">
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
        </div>

        {/* Headings */}
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mb-1.5 uppercase">
          Order Placement Successful!
        </h1>
        <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Payment Verified
        </span>

        {/* Processing Checklist */}
        <div className="w-full flex flex-col gap-3.5 my-8 text-left border-y border-slate-800/60 py-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200">Payment Successful</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200">Receipt Generated</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200 truncate">
              Receipt Sent To Email ({order.customerEmail})
            </span>
          </div>
        </div>

        {/* Metadata Details Card */}
        <div className="w-full bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col gap-3 text-xs text-left mb-8 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans font-semibold">Receipt Number</span>
            <span className="font-bold text-white text-right">{order.receiptNumber}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800/50 pt-3">
            <span className="text-slate-500 font-sans font-semibold">Order Reference</span>
            <span className="text-slate-300 text-right truncate max-w-[180px]">{order.orderId}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800/50 pt-3 text-sm">
            <span className="text-slate-500 font-sans font-black">Amount Paid</span>
            <span className="font-black text-emerald-400">₹{order.amount}</span>
          </div>
        </div>

        {/* Dynamic Action Panel (Buttons for PDF, View, Print, Resend) */}
        <SuccessPageActions receiptId={order.receiptNumber} />

        <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-wider">
          <Link
            href="/services"
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Facility Hub</span>
          </Link>
          <Link
            href="/my-receipts"
            className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 font-bold"
          >
            <span>Receipt History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
