"use client";

import { useState } from "react";
import { verifyReceiptOwnershipAction } from "@/app/actions";
import { Loader2, AlertCircle } from "lucide-react";

export default function ReceiptPortalClient({ receiptId }: { receiptId: string }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyReceiptOwnershipAction(receiptId, emailOrPhone);
      if (res.success) {
        window.location.reload();
      } else {
        setError(res.error || "Verification failed. Please check your input.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full">
      <div className="flex flex-col gap-1.5 text-left w-full">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          Email or Phone Number
        </label>
        <input
          type="text"
          required
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          placeholder="e.g. customer@email.com or 9876543210"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-all font-sans"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 disabled:cursor-wait"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </>
        ) : (
          <span>Verify & Access Receipt</span>
        )}
      </button>
    </form>
  );
}
