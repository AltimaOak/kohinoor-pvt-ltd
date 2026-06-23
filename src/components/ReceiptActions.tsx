"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { resendWhatsAppReceiptAction } from "@/app/actions";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.956.564 3.78 1.536 5.316L2 22l4.812-1.488A9.954 9.954 0 0012.004 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 1.5c4.686 0 8.5 3.814 8.5 8.5s-3.814 8.5-8.5 8.5a8.448 8.448 0 01-4.38-1.224l-.312-.192-2.736.84.852-2.616-.216-.336A8.44 8.44 0 013.504 12c0-4.686 3.814-8.5 8.5-8.5zm-3.666 4.308c-.144 0-.3.03-.432.09-.324.144-.552.456-.636.786-.18.732.096 1.704.816 2.658.744.978 1.758 1.83 2.766 2.37.768.408 1.5.588 2.082.492.366-.06.66-.27.768-.618.15-.474.072-.888-.36-1.104l-1.074-.534c-.3-.15-.552-.048-.756.222l-.33.438c-.096.126-.234.156-.372.084-.336-.18-.75-.492-1.086-.828-.336-.336-.648-.75-.828-1.086-.072-.138-.042-.276.084-.372l.438-.33c.27-.204.372-.456.222-.756l-.534-1.074c-.156-.312-.414-.462-.756-.462h-.03z" />
  </svg>
);

interface ReceiptActionsProps {
  pdfUrl?: string;
  receiptId: string;
}

export default function ReceiptActions({ pdfUrl, receiptId }: ReceiptActionsProps) {
  const [waResending, setWaResending] = useState(false);
  const [waResendStatus, setWaResendStatus] = useState<"idle" | "success" | "error">("idle");
  const [waErrorMsg, setWaErrorMsg] = useState("");

  // Trigger print automatically on component mount
  useEffect(() => {
    if (!window.location.search.includes("printed")) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleWaResend = async () => {
    setWaResending(true);
    setWaResendStatus("idle");
    setWaErrorMsg("");

    try {
      const res = await resendWhatsAppReceiptAction(receiptId);
      if (res.success) {
        setWaResendStatus("success");
      } else {
        setWaResendStatus("error");
        setWaErrorMsg(res.error || "Failed to resend.");
      }
    } catch (err) {
      setWaResendStatus("error");
      setWaErrorMsg("Connection error.");
    } finally {
      setWaResending(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-3 print:hidden">
      <div className="flex gap-4">
        <Link
          href="/services"
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
        >
          Back to Hub
        </Link>
        {pdfUrl && (
          <a
            href={pdfUrl}
            download={`Kohinoor_Receipt_${receiptId}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center"
          >
            Download PDF
          </a>
        )}
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
        >
          Print Copy
        </button>
        <button
          onClick={handleWaResend}
          disabled={waResending}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {waResending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <WhatsAppIcon className="w-3.5 h-3.5" />
          )}
          <span>WhatsApp Send</span>
        </button>
      </div>

      {waResendStatus === "success" && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-fade-in">
          WhatsApp receipt sent!
        </span>
      )}
      {waResendStatus === "error" && (
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full animate-fade-in">
          {waErrorMsg || "WhatsApp failed."}
        </span>
      )}
    </div>
  );
}
