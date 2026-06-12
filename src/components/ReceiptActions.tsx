"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ReceiptActionsProps {
  pdfUrl?: string;
  receiptId: string;
}

export default function ReceiptActions({ pdfUrl, receiptId }: ReceiptActionsProps) {
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

  return (
    <div className="mt-8 flex gap-4 print:hidden">
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
    </div>
  );
}
