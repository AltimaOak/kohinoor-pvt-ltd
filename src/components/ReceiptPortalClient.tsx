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
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
          Email or Phone Number
        </label>
        <input
          type="text"
          required
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          placeholder="e.g. customer@email.com or 9876543210"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 placeholder-slate-600 transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-semibold leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 disabled:cursor-wait"
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
