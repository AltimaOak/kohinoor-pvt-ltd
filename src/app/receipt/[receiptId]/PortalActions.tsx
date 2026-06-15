"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { resendEmailReceiptAction } from "@/app/actions";

export default function PortalActions({ receiptId }: { receiptId: string }) {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const handleResend = async () => {
    setResending(true);
    setResendStatus("idle");
    setErrorMsg("");

    try {
      const res = await resendEmailReceiptAction(receiptId);
      if (res.success) {
        setResendStatus("success");
      } else {
        setResendStatus("error");
        setErrorMsg(res.error || "Failed to resend.");
      }
    } catch (err) {
      setResendStatus("error");
      setErrorMsg("Connection error.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-3 print:hidden w-full max-w-lg">
      <div className="flex gap-4 w-full justify-center">
        <Link
          href="/services"
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center text-center shrink-0"
        >
          Back to Hub
        </Link>
        <a
          href={`/api/receipts/${receiptId}/pdf`}
          download={`Kohinoor_Receipt_${receiptId}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center cursor-pointer text-center shrink-0"
        >
          Download PDF
        </a>
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center justify-center text-center shrink-0"
        >
          Print Copy
        </button>
      </div>

      <button
        onClick={handleResend}
        disabled={resending}
        className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-all cursor-pointer disabled:opacity-50"
      >
        {resending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Mail className="w-3.5 h-3.5" />
        )}
        <span>Resend Receipt Email</span>
      </button>

      {resendStatus === "success" && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-fade-in">
          Email resent successfully!
        </span>
      )}
      {resendStatus === "error" && (
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full animate-fade-in">
          {errorMsg || "Resend failed."}
        </span>
      )}
    </div>
  );
}
