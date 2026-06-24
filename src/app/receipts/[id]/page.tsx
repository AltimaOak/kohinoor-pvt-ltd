import { getDb } from "@/app/actions";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import ReceiptActions from "@/components/ReceiptActions";

export const revalidate = 0; // Disable caching to fetch fresh DB values

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const db = await getDb();
  const receipt = db.receipts?.find((r) => r.id === id);

  if (!receipt) {
    notFound();
  }

  const dateFormatted = new Date(receipt.date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center font-sans antialiased print:bg-white print:py-0">
      {/* Auto print and printing controls are managed by ReceiptActions Client component */}

      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-xl p-8 print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center border-b border-dashed border-slate-200 pb-6 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Kohinoor Logo" className="h-full w-full object-contain p-2" />
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Kohinoor City Office Towers</h1>
          <p className="text-xs text-slate-500 font-medium">Tower B, Level 18, complex Estate & Premises Co-op Society Ltd</p>
          <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            Payment {receipt.paymentStatus}
          </span>
        </div>

        {/* Invoice Metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-2xl print:bg-slate-100">
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Receipt Number</span>
            <span className="font-mono font-bold text-slate-900">{receipt.id}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Date & Time</span>
            <span className="font-bold text-slate-900">{dateFormatted}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Customer Name</span>
            <span className="font-bold text-slate-900">{receipt.customerName}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Mobile Number</span>
            <span className="font-mono font-bold text-slate-900">+91 {receipt.customerPhone}</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Service Category</span>
            <span className="font-bold text-slate-900">{receipt.serviceType} Hub</span>
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Payment Method</span>
            <span className="font-bold text-slate-900">{receipt.paymentMethod}</span>
          </div>
        </div>

        {/* Invoice Line Items */}
        <div className="mb-6">
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Order Details</span>
          <div className="flex flex-col gap-3">
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs text-slate-700">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-slate-950">{item.name}</span>
                  <span className="text-[10px] text-slate-400">₹{item.price} per unit</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="font-medium text-slate-500">Qty: {item.quantity}</span>
                  <span className="font-extrabold text-slate-950 font-mono">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-slate-200 my-4" />

        {/* Invoice Total */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-black text-slate-900 uppercase tracking-wider">Total Amount Paid</span>
          <span className="text-2xl font-black text-slate-900 font-mono">₹{receipt.totalAmountPaid}</span>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 leading-normal border-t border-dashed border-slate-200 pt-6">
          <p className="font-bold text-slate-500">Thank you for your business!</p>
          <p className="mt-1">For any queries regarding this receipt, please contact Kohinoor Facility Hub.</p>
          <p className="mt-0.5">This is a system generated e-receipt issued under Kohinoor Co-op Society regulations.</p>
        </div>

      </div>

      {/* Action Buttons */}
      <ReceiptActions pdfUrl={receipt.pdfUrl} receiptId={receipt.id} />

    </div>
  );
}
