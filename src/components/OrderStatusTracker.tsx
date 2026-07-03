"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Utensils, 
  Store, 
  CheckCircle2, 
  Loader2, 
  RefreshCw 
} from "lucide-react";
import { getOrderStatusAction, updateOrderStatusAction } from "@/app/actions";

interface OrderStatusTrackerProps {
  receiptId: string;
  serviceType: "Nursery" | "Cafeteria";
  initialStatus?: "placed" | "preparing" | "ready" | "completed";
}

type StepStatus = "placed" | "preparing" | "ready" | "completed";

export default function OrderStatusTracker({ 
  receiptId, 
  serviceType,
  initialStatus = "placed"
}: OrderStatusTrackerProps) {
  const [status, setStatus] = useState<StepStatus>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [pollingActive, setPollingActive] = useState(true);

  // Poll server for status changes
  useEffect(() => {
    if (!pollingActive) return;

    const interval = setInterval(async () => {
      try {
        const res = await getOrderStatusAction(receiptId);
        if (res.success && res.status) {
          setStatus(res.status);
          if (res.status === "completed") {
            setPollingActive(false); // Stop polling when completed
          }
        }
      } catch (err) {
        console.error("Failed to poll order status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [receiptId, pollingActive]);

  // Handle manual status advancement for testing/simulation
  const handleSimulateNextStage = async () => {
    const sequence: StepStatus[] = ["placed", "preparing", "ready", "completed"];
    const currentIndex = sequence.indexOf(status);
    if (currentIndex === -1 || currentIndex === sequence.length - 1) return;

    const nextStatus = sequence[currentIndex + 1];
    setLoading(true);
    try {
      const res = await updateOrderStatusAction(receiptId, nextStatus);
      if (res.success) {
        setStatus(nextStatus);
        if (nextStatus === "completed") {
          setPollingActive(false);
        }
      }
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      key: "placed" as StepStatus,
      title: "Order Placed",
      timeText: "Verified",
      desc: "Payment verified, order registered at Kohinoor Hub.",
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-500",
      activeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400"
    },
    {
      key: "preparing" as StepStatus,
      title: serviceType === "Cafeteria" ? "Preparing Food" : "Selecting Plants",
      timeText: "In Progress",
      desc: serviceType === "Cafeteria" 
        ? "Chef is cooking your fresh hot selection." 
        : "Nursery staff is choosing and preparing your items.",
      icon: Utensils,
      color: "from-amber-500 to-orange-500",
      activeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400"
    },
    {
      key: "ready" as StepStatus,
      title: "Ready for Pickup",
      timeText: "Awaiting Collection",
      desc: serviceType === "Cafeteria"
        ? "Please collect your order at Tower A Ground Floor Cafeteria counter."
        : "Please collect your items at Tower B Plaza Green Canopy counter.",
      icon: Store,
      color: "from-sky-500 to-teal-500",
      activeBg: "bg-sky-500/10 border-sky-500/30 text-sky-400"
    },
    {
      key: "completed" as StepStatus,
      title: "Order Picked Up",
      timeText: "Handed Over",
      desc: "Order successfully collected. Thank you for your order!",
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-500",
      activeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
    }
  ];

  const getStepIndex = (st: StepStatus) => {
    const seq: StepStatus[] = ["placed", "preparing", "ready", "completed"];
    return seq.indexOf(st);
  };

  const currentIdx = getStepIndex(status);

  return (
    <div className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm flex flex-col gap-6 select-none relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/[0.02] rounded-full blur-2xl pointer-events-none" />

      {/* Header section with live indicator */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
        <div className="flex flex-col text-left">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Order Progress</span>
          <h3 className="text-sm sm:text-base font-black text-slate-900 leading-none mt-1">Live Order Tracking</h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-600 text-[10px] font-bold tracking-wider uppercase animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live Tracking
        </div>
      </div>

      {/* Steps timeline container */}
      <div className="flex flex-col gap-5 relative pl-4 mt-2">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = currentIdx > index;
          const isActive = currentIdx === index;
          const isUpcoming = currentIdx < index;

          return (
            <div key={step.key} className="flex gap-4 relative text-left">
              {/* Stepper line connector */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute left-4.5 top-9 bottom-0 w-[2px] -ml-[1px] transition-all duration-700 ${
                    isCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`} 
                />
              )}

              {/* Stepper circular node */}
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition-all duration-500 relative z-10 ${
                  isCompleted 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm shadow-emerald-500/5" 
                    : isActive 
                    ? "bg-sky-50 border-sky-400 text-sky-600 shadow-md shadow-sky-500/10 scale-110" 
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full border border-sky-400/50 animate-ping opacity-60 pointer-events-none" />
                )}
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>

              {/* Step info details */}
              <div className="flex flex-col gap-1 py-1">
                <div className="flex items-center gap-2">
                  <h4 
                    className={`text-sm font-extrabold tracking-tight transition-colors duration-300 ${
                      isActive ? "text-slate-900 text-base" : isCompleted ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isActive && (
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-600 leading-none">
                      Active
                    </span>
                  )}
                </div>
                <p 
                  className={`text-xs leading-normal transition-colors duration-300 ${
                    isActive ? "text-slate-600 font-medium" : isCompleted ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Tools (For testing transitions) */}
      {status !== "completed" && (
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase">Demo System Control</span>
          <button
            onClick={handleSimulateNextStage}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>Advance Status (Next Stage)</span>
          </button>
        </div>
      )}
    </div>
  );
}
