"use client";

import { useState } from "react";
import { getCustomerReceiptsAction, Order } from "@/app/actions";
import {
  Search,
  Download,
  Eye,
  Printer,
  History,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Leaf,
  Coffee,
  ArrowRight,
  Home
} from "lucide-react";
import Link from "next/link";

export default function MyReceiptsPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg("Please enter your email or phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await getCustomerReceiptsAction(emailOrPhone);
      if (res.success && res.orders) {
        setOrders(res.orders);
        setIsVerified(true);
      } else {
        setErrorMsg(res.error || "Failed to retrieve receipt history.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (receiptId: string) => {
    window.open(`/receipt/${receiptId}?printed=true`, "_blank");
  };

  // Filter receipt list
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService = serviceFilter === "all" || o.serviceType === serviceFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(o.createdAt);
      const limitDate = new Date();
      if (dateFilter === "30days") {
        limitDate.setDate(limitDate.getDate() - 30);
      } else if (dateFilter === "90days") {
        limitDate.setDate(limitDate.getDate() - 90);
      } else if (dateFilter === "365days") {
        limitDate.setDate(limitDate.getDate() - 365);
      }
      matchesDate = orderDate >= limitDate;
    }

    return matchesSearch && matchesService && matchesDate;
  });

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased px-4 relative overflow-hidden">
        {/* Glow backdrop bubble */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xl relative z-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-600">
              <History className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display uppercase">
              Customer Receipt Center
            </h1>
            <p className="text-xs text-slate-500 max-w-[280px]">
              Enter the email address or phone number associated with your checkout to query your history.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-4 mt-8 w-full">
            <div className="flex flex-col gap-1.5 text-left w-full">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Email Address or Phone
              </label>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. adrian@corp.com or 9876543210"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 focus:bg-white placeholder-slate-400 transition-all font-sans"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs font-semibold leading-relaxed text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
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
                  <span>Retrieving history...</span>
                </>
              ) : (
                <span>Retrieve Receipts</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
              <History className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-black text-slate-900 leading-none font-display uppercase">
                Your Receipts History
              </h1>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-wider">
                Authorized for: {emailOrPhone}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="text-[10px] font-black uppercase text-slate-600 hover:text-navy-900 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1 font-sans"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Services Hub</span>
            </Link>
            <button
              onClick={() => {
                setIsVerified(false);
                setOrders([]);
              }}
              className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm font-sans"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* Filters and Search panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm items-center">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by receipt #, item name, order reference..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-2xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors font-sans"
            />
          </div>

          {/* Service filter */}
          <div className="md:col-span-3 flex items-center gap-2 border border-slate-100 p-1 rounded-2xl bg-slate-50/50">
            <span className="text-[9px] font-black text-slate-400 uppercase pl-2 select-none">Service</span>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full text-xs font-bold text-slate-700 bg-transparent py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Services</option>
              <option value="Nursery">Nursery</option>
              <option value="Cafeteria">Cafeteria</option>
            </select>
          </div>

          {/* Date filter */}
          <div className="md:col-span-3 flex items-center gap-2 border border-slate-100 p-1 rounded-2xl bg-slate-50/50">
            <span className="text-[9px] font-black text-slate-400 uppercase pl-2 select-none">Date</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full text-xs font-bold text-slate-700 bg-transparent py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="365days">Last Year</option>
            </select>
          </div>
        </div>

        {/* List of orders */}
        <div className="flex flex-col gap-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-400 shadow-sm">
              <ShoppingBag className="w-12 h-12 stroke-[1] text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold">No matching receipts found in history.</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                Try expanding your filters or search terms. If you checked out recently, verify your details are correct.
              </p>
            </div>
          ) : (
            filteredOrders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => {
                const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                });
                return (
                  <div
                    key={order.receiptNumber}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group"
                  >
                    {/* Icon & Receipt Metadata */}
                    <div className="md:col-span-5 flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                          order.serviceType === "Nursery"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {order.serviceType === "Nursery" ? (
                          <Leaf className="w-5.5 h-5.5" />
                        ) : (
                          <Coffee className="w-5.5 h-5.5" />
                        )}
                      </div>

                      <div className="flex flex-col text-left">
                        <span className="font-mono font-bold text-slate-700 text-sm leading-tight group-hover:text-sky-600 transition-colors">
                          {order.receiptNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          Placed: {orderDate} | {order.serviceType}
                        </span>
                      </div>
                    </div>

                    {/* Order summary list */}
                    <div className="md:col-span-3 text-left md:text-center">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider select-none">
                        Ordered Items
                      </span>
                      <span className="text-xs font-bold text-slate-700 truncate block max-w-[180px] md:mx-auto">
                        {order.items.map((it) => `${it.name} x${it.quantity}`).join(", ")}
                      </span>
                    </div>

                    {/* Paid Amount */}
                    <div className="md:col-span-2 text-left md:text-right">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider select-none">
                        Total Paid
                      </span>
                      <span className="text-base font-black text-slate-900 font-mono">
                        ₹{order.amount}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-2 flex items-center gap-2 justify-end">
                      <Link
                        href={`/receipt/${order.receiptNumber}`}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer shrink-0 flex items-center justify-center"
                        title="View Portal"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a
                        href={`/api/receipts/${order.receiptNumber}/pdf`}
                        download={`Kohinoor_Receipt_${order.receiptNumber}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer shrink-0 flex items-center justify-center"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handlePrint(order.receiptNumber)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer shrink-0 flex items-center justify-center"
                        title="Print Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }))}
        </div>

      </div>
    </div>
  );
}
