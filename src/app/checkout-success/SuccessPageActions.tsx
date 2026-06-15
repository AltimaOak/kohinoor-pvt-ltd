"use client";

import { useState } from "react";
import { Loader2, Mail, Download, Eye, Printer } from "lucide-react";
import { resendEmailReceiptAction } from "@/app/actions";

export default function SuccessPageActions({ receiptId }: { receiptId: string }) {
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePrint = () => {
    // Open receipt portal in print-ready layout
    window.open(`/receipt/${receiptId}?printed=true`, "_blank");
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
    <div className="flex flex-col items-center gap-3.5 w-full">
      <div className="grid grid-cols-3 gap-3 w-full">
        <a
          href={`/api/receipts/${receiptId}/pdf`}
          download={`Kohinoor_Receipt_${receiptId}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center shrink-0"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>Download</span>
        </a>
        <a
          href={`/receipt/${receiptId}`}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center shrink-0"
        >
          <Eye className="w-4 h-4 text-sky-400" />
          <span>View Portal</span>
        </a>
        <button
          onClick={handlePrint}
          className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center shrink-0"
        >
          <Printer className="w-4 h-4 text-sky-400" />
          <span>Print Copy</span>
        </button>
      </div>

      <button
        onClick={handleResend}
        disabled={resending}
        className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all cursor-pointer disabled:opacity-50 font-bold"
      >
        {resending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Mail className="w-3.5 h-3.5" />
        )}
        <span>Resend Receipt Email</span>
      </button>

      {resendStatus === "success" && (
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-fade-in">
          Email resent successfully!
        </span>
      )}
      {resendStatus === "error" && (
        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full animate-fade-in">
          {errorMsg || "Resend failed."}
        </span>
      )}
    </div>
  );
}
