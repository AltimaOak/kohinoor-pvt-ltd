"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Settings,
  Calendar,
  Briefcase,
  Image as ImageIcon,
  PhoneCall,
  Plus,
  Trash2,
  Edit,
  Save,
  Upload,
  LogOut,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  X,
  Loader2,
  Building,
  Activity,
  Heart,
  Sparkles,
  Gift,
  Compass,
  Zap,
  Shield,
  Cpu,
  Video,
  ArrowUpDown,
  Car,
  BatteryCharging,
  Flame,
  HelpCircle,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import {
  getDb,
  updateDb,
  loginAction,
  logoutAction,
  checkAuth,
  uploadPhotoAction,
  DatabaseSchema,
  EventItem,
  ServiceItem,
  PhotoItem,
  ManagerItem
} from "@/app/actions";
import * as LucideIcons from "lucide-react";

// Curated list of popular Lucide Icons for selection
const POPULAR_ICONS = [
  "Activity", "Heart", "Sparkles", "Gift", "Compass", "Droplet",
  "Zap", "Shield", "Cpu", "Video", "ArrowUpDown", "Lock", "Car",
  "BatteryCharging", "Flame", "Building", "Phone", "Mail", "MapPin"
];

// Helper to render Lucide Icons by name dynamically
const IconPreview = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [submittingLogin, setSubmittingLogin] = useState(false);

  // Database state
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [activeTab, setActiveTab] = useState<"events" | "services" | "photos" | "contacts">("events");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState(false);

  // Edit states for modals / forms
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  // Temporary feature text for services input
  const [newFeatureText, setNewFeatureText] = useState("");

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch auth & database on load
  useEffect(() => {
    async function init() {
      try {
        const isAuth = await checkAuth();
        setAuthenticated(isAuth);
        if (isAuth) {
          const data = await getDb();
          setDb(data);
        }
      } catch (err) {
        showToast("error", "Failed to connect to the database");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setLoginError("Please enter a password");
      return;
    }

    setSubmittingLogin(true);
    setLoginError("");

    try {
      const res = await loginAction(password);
      if (res.success) {
        setAuthenticated(true);
        const data = await getDb();
        setDb(data);
        showToast("success", "Successfully logged in as administrator");
      } else {
        setLoginError(res.error || "Incorrect password");
      }
    } catch (err) {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      setAuthenticated(false);
      setDb(null);
      setPassword("");
      showToast("info", "Logged out successfully");
    } catch (err) {
      showToast("error", "Logout failed");
    }
  };

  // Generic DB Save function
  const saveDatabase = async (updatedDb: DatabaseSchema) => {
    setSaving(true);
    try {
      const res = await updateDb(updatedDb);
      if (res.success) {
        setDb(updatedDb);
        showToast("success", "Database changes published successfully");
        return true;
      } else {
        showToast("error", res.error || "Failed to publish database");
        return false;
      }
    } catch (err) {
      showToast("error", "Server communication failed");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, forEdit: "new" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);
    showToast("info", "Uploading image...");

    try {
      const res = await uploadPhotoAction(formData);
      if (res.success && res.url) {
        showToast("success", "Image uploaded successfully");
        if (forEdit === "new") {
          setEditingPhoto((prev) => prev ? { ...prev, src: res.url! } : {
            id: "",
            title: "",
            category: "exterior",
            categoryLabel: "Exterior",
            src: res.url!,
            description: ""
          });
        } else {
          setEditingPhoto((prev) => prev ? { ...prev, src: res.url! } : null);
        }
      } else {
        showToast("error", res.error || "Image upload failed");
      }
    } catch (err) {
      showToast("error", "Server error during image upload");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ==========================================
  // EVENT OPERATIONS
  // ==========================================
  const handleSaveEvent = async () => {
    if (!db || !editingEvent) return;
    if (!editingEvent.title || !editingEvent.desc) {
      showToast("error", "Please fill in all event fields");
      return;
    }

    let updatedEvents = [...db.events];
    if (isAddingEvent) {
      updatedEvents.push({
        ...editingEvent,
        id: `evt-${Date.now()}`
      });
    } else {
      updatedEvents = updatedEvents.map((evt) =>
        evt.id === editingEvent.id ? editingEvent : evt
      );
    }

    const success = await saveDatabase({ ...db, events: updatedEvents });
    if (success) {
      setEditingEvent(null);
      setIsAddingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this event?")) return;

    const updatedEvents = db.events.filter((evt) => evt.id !== id);
    await saveDatabase({ ...db, events: updatedEvents });
  };

  // ==========================================
  // SERVICE OPERATIONS
  // ==========================================
  const handleSaveService = async () => {
    if (!db || !editingService) return;
    if (!editingService.title || !editingService.shortDesc || !editingService.longDesc) {
      showToast("error", "Please fill in all core service fields");
      return;
    }

    let iconName = editingService.iconName;
    if (editingService.glowColor.includes("rose")) iconName = "Activity";
    else if (editingService.glowColor.includes("sky")) iconName = "Heart";
    else if (editingService.glowColor.includes("emerald")) iconName = "Shield";
    else if (editingService.glowColor.includes("amber")) iconName = "Compass";

    const serviceToSave = { ...editingService, iconName };

    let updatedServices = [...db.services];
    if (isAddingService) {
      updatedServices.push({
        ...serviceToSave,
        id: `svc-${Date.now()}`
      });
    } else {
      updatedServices = updatedServices.map((svc) =>
        svc.id === editingService.id ? serviceToSave : svc
      );
    }

    const success = await saveDatabase({ ...db, services: updatedServices });
    if (success) {
      setEditingService(null);
      setIsAddingService(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this service?")) return;

    const updatedServices = db.services.filter((svc) => svc.id !== id);
    await saveDatabase({ ...db, services: updatedServices });
  };

  // ==========================================
  // GALLERY PHOTO OPERATIONS
  // ==========================================
  const handleSavePhoto = async () => {
    if (!db || !editingPhoto) return;
    if (!editingPhoto.title || !editingPhoto.src || !editingPhoto.description) {
      showToast("error", "Please fill in all photo details and upload/input an image path");
      return;
    }

    let updatedPhotos = [...db.photos];
    if (isAddingPhoto) {
      updatedPhotos.push({
        ...editingPhoto,
        id: `gal-${Date.now()}`
      });
    } else {
      updatedPhotos = updatedPhotos.map((p) =>
        p.id === editingPhoto.id ? editingPhoto : p
      );
    }

    const success = await saveDatabase({ ...db, photos: updatedPhotos });
    if (success) {
      setEditingPhoto(null);
      setIsAddingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this photo from the gallery?")) return;

    const updatedPhotos = db.photos.filter((p) => p.id !== id);
    await saveDatabase({ ...db, photos: updatedPhotos });
  };

  // ==========================================
  // CONTACTS OPERATIONS
  // ==========================================
  const handleUpdateContactDetails = async (field: "siteAddress" | "siteAddressMapLink", value: string) => {
    if (!db) return;
    const updatedDb = {
      ...db,
      contacts: {
        ...db.contacts,
        [field]: value
      }
    };
    setDb(updatedDb); // Local update only until publish or save
  };

  const handleUpdateManager = (managerId: string, field: keyof ManagerItem, value: string) => {
    if (!db) return;
    const updatedManagers = db.contacts.managers.map((mgr) => {
      if (mgr.id === managerId) {
        let category = mgr.category;
        if (field === "role" && value.toLowerCase().includes("security")) {
          category = "Security & Safety";
        } else if (field === "role" && value.toLowerCase().includes("property")) {
          category = "Property & Facility";
        }
        return { ...mgr, [field]: value, category };
      }
      return mgr;
    });

    setDb({
      ...db,
      contacts: {
        ...db.contacts,
        managers: updatedManagers
      }
    });
  };

  const handleAddManager = () => {
    if (!db) return;
    const newMgr: ManagerItem = {
      id: `mgr-${Date.now()}`,
      name: "New Manager",
      role: "Operations Assistant",
      category: "Operations Support",
      phone: "0000000000",
      email: "new.manager@kohinoorcommercial2.in",
      colorTheme: "sky"
    };

    setDb({
      ...db,
      contacts: {
        ...db.contacts,
        managers: [...db.contacts.managers, newMgr]
      }
    });
    showToast("info", "New contact manager added to local list. Remember to publish changes!");
  };

  const handleDeleteManager = (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this contact manager?")) return;

    const updatedManagers = db.contacts.managers.filter((mgr) => mgr.id !== id);
    setDb({
      ...db,
      contacts: {
        ...db.contacts,
        managers: updatedManagers
      }
    });
    showToast("info", "Contact manager removed from local list. Remember to publish changes!");
  };

  const handlePublishContacts = async () => {
    if (!db) return;
    await saveDatabase(db);
  };

  // Render Spinner during load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 text-white flex-col gap-4">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
        <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Loading Admin System...</span>
      </div>
    );
  }

  // Render Login screen if not logged in
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,#1e293b,transparent_60%)] bg-navy-950 p-6 relative overflow-hidden">
        {/* Glow bubbles */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="relative max-w-md w-full glass-card-dark p-10 rounded-[32px] border border-white/10 shadow-2xl flex flex-col items-center text-center gap-6"
        >
          {/* Logo Icon */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-white flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Kohinoor Logo"
              className="h-full w-full object-contain p-1.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-black text-white font-display tracking-tight leading-none">
              Kohinoor Commercial II
            </h1>
            <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest">
              Administrative Gateway
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-[280px]">
            Please enter your administrative access password to manage events, services, photos, and directory contacts.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-left text-xs font-semibold"
              >
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submittingLogin}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {submittingLogin ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validating access...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4.5 h-4.5" />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-navy-900 font-sans relative">
      {/* Dynamic Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`p-4 rounded-2xl border shadow-lg flex items-start gap-3 backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800"
                  : toast.type === "error"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-800"
                  : "bg-sky-500/10 border-sky-500/20 text-sky-800"
              }`}
            >
              {toast.type === "success" && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />}
              {toast.type === "info" && <Loader2 className="w-5 h-5 shrink-0 text-sky-600 animate-spin" />}
              <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/60 py-4 px-6 md:px-12 flex items-center justify-between shadow-[0_2px_15px_rgba(15,23,42,0.02)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
            <img src="/images/logo.png" alt="Kohinoor Logo" className="h-full w-full object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-navy-900 tracking-tight leading-none">
              Kohinoor City Office Towers
            </span>
            <span className="text-[7.5px] uppercase tracking-wider text-sky-500 font-extrabold mt-0.5">
              Admin Control Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saving && (
            <span className="text-xs text-sky-600 font-bold flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
              Saving changes...
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-bold text-slate-600 hover:text-navy-900 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT PANEL */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel Sidebar Links (3 Columns) */}
          <div className="lg:col-span-3 flex flex-col gap-2 bg-white border border-slate-200/60 p-4 rounded-3xl shadow-sm">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-3 mb-2">
              Database Sections
            </span>
            {[
              { id: "events", label: "Community Events", icon: Calendar, color: "text-amber-500 bg-amber-50" },
              { id: "services", label: "Healthcare & Services", icon: Briefcase, color: "text-rose-500 bg-rose-50" },
              { id: "photos", label: "Interactive Gallery", icon: ImageIcon, color: "text-sky-500 bg-sky-50" },
              { id: "contacts", label: "Contacts & Directory", icon: PhoneCall, color: "text-emerald-500 bg-emerald-50" },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    // Close edit states
                    setEditingEvent(null);
                    setEditingService(null);
                    setEditingPhoto(null);
                  }}
                  className={`flex items-center gap-3.5 px-4.5 py-4 rounded-2xl w-full text-left transition-all ${
                    isSelected
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/10 font-bold"
                      : "hover:bg-slate-50 text-slate-600 hover:text-navy-900 font-semibold"
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-white/20 text-white" : tab.color}`}>
                    <TabIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Panel Main Data Dashboard (9 Columns) */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* ==============================================================
                EVENTS TAB CONTENT
                ============================================================== */}
            {activeTab === "events" && db && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Community Events</h2>
                    <p className="text-xs text-slate-500">Manage celebrations, camps, and corporate challenges.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingEvent(true);
                      setEditingEvent({
                        id: "",
                        title: "",
                        desc: "",
                        iconName: "Sparkles"
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </div>

                {/* Event Form (Add/Edit) */}
                {editingEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-sky-300 p-8 rounded-3xl shadow-md flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 flex items-center gap-2">
                        {isAddingEvent ? <Plus className="w-4.5 h-4.5" /> : <Edit className="w-4.5 h-4.5" />}
                        <span>{isAddingEvent ? "Add New Event" : "Edit Event details"}</span>
                      </h3>
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setIsAddingEvent(false);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Title</label>
                        <input
                          type="text"
                          value={editingEvent.title}
                          onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          placeholder="e.g. Annual Blood Donation Drive"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 justify-end">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Selected Icon Preview</span>
                        <div className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl max-w-max">
                          <IconPreview name={editingEvent.iconName} className="w-5.5 h-5.5 text-sky-500 stroke-[2.5]" />
                          <span className="text-xs font-bold text-slate-700">{editingEvent.iconName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Choose a visual icon (Click to select)</label>
                      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 border border-slate-200/80 p-3.5 rounded-2xl bg-slate-50 max-h-36 overflow-y-auto">
                        {POPULAR_ICONS.map((ico) => {
                          const isSelected = editingEvent.iconName === ico;
                          return (
                            <button
                              key={ico}
                              type="button"
                              onClick={() => setEditingEvent({ ...editingEvent, iconName: ico })}
                              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/10 scale-105"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-navy-900"
                              }`}
                              title={ico}
                            >
                              <IconPreview name={ico} className="w-4.5 h-4.5 stroke-[2]" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                      <textarea
                        value={editingEvent.desc}
                        onChange={(e) => setEditingEvent({ ...editingEvent, desc: e.target.value })}
                        placeholder="Detailed brief describing the purpose, timing, and coordinate layout of the event..."
                        rows={3}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setIsAddingEvent(false);
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-500 hover:text-navy-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEvent}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/10 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Event</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Events list */}
                <div className="flex flex-col gap-4">
                  {db.events.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-slate-200 p-8 rounded-3xl text-slate-400 text-xs font-bold">
                      No events currently listed. Click "Add Event" to add one!
                    </div>
                  ) : (
                    db.events.map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex items-start justify-between gap-6 group hover:border-sky-300/65 transition-all duration-300"
                      >
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 bg-sky-500/5 border border-sky-400/20 rounded-2xl flex items-center justify-center shrink-0 text-sky-500">
                            <IconPreview name={evt.iconName} className="w-5.5 h-5.5 stroke-[2]" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <h4 className="text-sm font-extrabold text-navy-900 group-hover:text-sky-600 transition-colors leading-snug">
                              {evt.title}
                            </h4>
                            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">{evt.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setIsAddingEvent(false);
                              setEditingEvent(evt);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==============================================================
                SERVICES TAB CONTENT
                ============================================================== */}
            {activeTab === "services" && db && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Healthcare & Medical Services</h2>
                    <p className="text-xs text-slate-500">Manage standby response systems, clinics, or welfare schedules.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingService(true);
                      setEditingService({
                        id: "",
                        title: "",
                        shortDesc: "",
                        longDesc: "",
                        features: [],
                        iconName: "Activity",
                        glowColor: "from-rose-500/20 to-red-600/30"
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </div>

                {/* Service Form (Add/Edit) */}
                {editingService && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-sky-300 p-8 rounded-3xl shadow-md flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 flex items-center gap-2">
                        {isAddingService ? <Plus className="w-4.5 h-4.5" /> : <Edit className="w-4.5 h-4.5" />}
                        <span>{isAddingService ? "Add New Service" : "Edit Service details"}</span>
                      </h3>
                      <button
                        onClick={() => {
                          setEditingService(null);
                          setIsAddingService(false);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Service Name</label>
                        <input
                          type="text"
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          placeholder="e.g. On-site Medical Clinic"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Service Card Glow Theme (Click to select)</label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { value: "from-rose-500/20 to-red-600/30", label: "Warning Red (Emergency / Ambulance)", color: "bg-rose-500" },
                          { value: "from-sky-400/20 to-sky-500/30", label: "Neutral Blue (General / Medical)", color: "bg-sky-500" },
                          { value: "from-emerald-400/20 to-emerald-500/30", label: "Safety Green (Security / Safety)", color: "bg-emerald-500" },
                          { value: "from-amber-400/20 to-amber-500/30", label: "Gold Yellow (Highlight / Specials)", color: "bg-amber-500" },
                        ].map((opt) => {
                          const isSelected = editingService.glowColor === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setEditingService({ ...editingService, glowColor: opt.value })}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full ${opt.color} shrink-0`} />
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Short Summary</label>
                      <input
                        type="text"
                        value={editingService.shortDesc}
                        onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                        placeholder="Brief 1-line description of availability (e.g. 24/7 emergency medical transit)"
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Detailed Description</label>
                      <textarea
                        value={editingService.longDesc}
                        onChange={(e) => setEditingService({ ...editingService, longDesc: e.target.value })}
                        placeholder="Complete paragraphs describing this medical support facility..."
                        rows={3}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Features Checklist Builder */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Features / Bullet List</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editingService.features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-navy-800 text-[10px] font-bold border border-slate-200"
                          >
                            <span>{feature}</span>
                            <button
                              onClick={() => {
                                const remaining = editingService.features.filter((_, idx) => idx !== i);
                                setEditingService({ ...editingService, features: remaining });
                              }}
                              className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFeatureText}
                          onChange={(e) => setNewFeatureText(e.target.value)}
                          placeholder="e.g. Dedicated Cardiac Monitors Onboard"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (newFeatureText.trim()) {
                                setEditingService({
                                  ...editingService,
                                  features: [...editingService.features, newFeatureText.trim()]
                                });
                                setNewFeatureText("");
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newFeatureText.trim()) {
                              setEditingService({
                                ...editingService,
                                features: [...editingService.features, newFeatureText.trim()]
                              });
                              setNewFeatureText("");
                            }
                          }}
                          className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shrink-0 transition-colors"
                        >
                          Add Feature
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setEditingService(null);
                          setIsAddingService(false);
                          setNewFeatureText("");
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-500 hover:text-navy-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveService}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/10 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Service</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Services list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {db.services.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-white border border-slate-200 p-8 rounded-3xl text-slate-400 text-xs font-bold">
                      No services currently listed. Click "Add Service" to create one!
                    </div>
                  ) : (
                    db.services.map((svc) => (
                      <div
                        key={svc.id}
                        className="bg-white border border-slate-200/50 p-6 rounded-[28px] shadow-sm flex flex-col gap-5 hover:border-sky-300 transition-all duration-300 group relative"
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-sky-500/10 border border-sky-400/20 text-sky-500 rounded-2xl flex items-center justify-center shrink-0">
                            <IconPreview name={svc.iconName} className="w-6 h-6 stroke-[2]" />
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setIsAddingService(false);
                                setEditingService(svc);
                              }}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors"
                            >
                              <Edit className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(svc.id)}
                              className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <h4 className="font-extrabold text-sm text-navy-900 group-hover:text-sky-600 transition-colors">
                            {svc.title}
                          </h4>
                          <span className="text-[10px] font-bold text-sky-500 leading-snug">{svc.shortDesc}</span>
                          <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3 mt-1">{svc.longDesc}</p>
                        </div>

                        <div className="h-px bg-slate-100 w-full" />
                        <ul className="flex flex-col gap-2">
                          {svc.features.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="text-[10.5px] font-semibold text-slate-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                          {svc.features.length > 3 && (
                            <li className="text-[9px] font-bold text-slate-400 italic">
                              + {svc.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==============================================================
                GALLERY TAB CONTENT
                ============================================================== */}
            {activeTab === "photos" && db && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Interactive Photo Gallery</h2>
                    <p className="text-xs text-slate-500">Add interior, exterior, walkways or lounge photos of Tower 2.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingPhoto(true);
                      setEditingPhoto({
                        id: "",
                        title: "",
                        category: "exterior",
                        categoryLabel: "Exterior",
                        src: "",
                        description: ""
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {/* Photo Form (Add/Edit) */}
                {editingPhoto && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-sky-300 p-8 rounded-3xl shadow-md flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 flex items-center gap-2">
                        {isAddingPhoto ? <Plus className="w-4.5 h-4.5" /> : <Edit className="w-4.5 h-4.5" />}
                        <span>{isAddingPhoto ? "Add New Photo" : "Edit Photo details"}</span>
                      </h3>
                      <button
                        onClick={() => {
                          setEditingPhoto(null);
                          setIsAddingPhoto(false);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      
                      {/* Form Details Column (8 cols) */}
                      <div className="md:col-span-8 flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Photo Title</label>
                            <input
                              type="text"
                              value={editingPhoto.title}
                              onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                              placeholder="e.g. Landmark West Plaza Plaza Entrance"
                              className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category Category</label>
                            <select
                              value={editingPhoto.category}
                              onChange={(e) => {
                                const val = e.target.value as "exterior" | "interior" | "lounge" | "amenities";
                                const labelMap: Record<"exterior" | "interior" | "lounge" | "amenities", string> = {
                                  exterior: "Exterior",
                                  interior: "Interior",
                                  lounge: "Lounge Area",
                                  amenities: "Amenities Grid"
                                };
                                setEditingPhoto({
                                  ...editingPhoto,
                                  category: val,
                                  categoryLabel: labelMap[val]
                                });
                              }}
                              className="px-3 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold text-slate-700"
                            >
                              <option value="exterior">Exterior</option>
                              <option value="interior">Interior</option>
                              <option value="lounge">Lounge Area</option>
                              <option value="amenities">Amenities Grid</option>
                            </select>
                          </div>
                        </div>

                        {/* Image source method: upload vs custom URL */}
                        <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image Attachment</label>
                          
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={(e) => handleImageUpload(e, isAddingPhoto ? "new" : "edit")}
                            className="hidden"
                            id="gallery-file-upload"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Visual upload click card */}
                            <div
                              onClick={() => document.getElementById("gallery-file-upload")?.click()}
                              className="border-2 border-dashed border-slate-200 hover:border-sky-400 hover:bg-sky-500/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 bg-slate-50/50"
                            >
                              <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-600 flex items-center justify-center">
                                {uploadingImage ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <Upload className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-navy-900">Click to upload photo</span>
                                <span className="text-[9px] text-slate-400">PNG, JPG, JPEG up to 5MB</span>
                              </div>
                            </div>

                            {/* Manual URL input card */}
                            <div className="flex flex-col justify-center gap-2.5 p-5 border border-slate-200 rounded-2xl bg-white">
                              <span className="text-[9px] font-bold uppercase text-slate-400">Or use a web image link</span>
                              <input
                                type="text"
                                value={editingPhoto.src}
                                onChange={(e) => setEditingPhoto({ ...editingPhoto, src: e.target.value })}
                                placeholder="Paste URL e.g. https://images.unsplash.com/..."
                                className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description/Caption</label>
                          <textarea
                            value={editingPhoto.description}
                            onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                            placeholder="Brief caption describing the architectural highlights in this photo..."
                            rows={2}
                            className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Preview Image Column (4 cols) */}
                      <div className="md:col-span-4 flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image Preview</label>
                        <div className="aspect-[4/3] w-full border border-slate-200 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative">
                          {editingPhoto.src ? (
                            <img
                              src={editingPhoto.src}
                              alt="Upload preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = ""; // Clear if broken
                                showToast("error", "Image source URL is invalid or inaccessible");
                              }}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 text-center gap-2 p-4">
                              <Building className="w-10 h-10 text-slate-300 opacity-80" />
                              <span className="text-[9px] font-bold uppercase tracking-wide">No image uploaded/linked</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-2">
                      <button
                        onClick={() => {
                          setEditingPhoto(null);
                          setIsAddingPhoto(false);
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-500 hover:text-navy-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSavePhoto}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/10 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Photo</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {db.photos.length === 0 ? (
                    <div className="col-span-3 text-center py-12 bg-white border border-slate-200 p-8 rounded-3xl text-slate-400 text-xs font-bold">
                      No gallery photos currently uploaded. Click "Add Photo" to begin!
                    </div>
                  ) : (
                    db.photos.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-sm hover:border-sky-300 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-100">
                          <img
                            src={p.src}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              // If image file/path fails, show fallback container
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          
                          {/* Category Badge overlay */}
                          <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 text-[8.5px] font-black text-sky-600 uppercase tracking-widest">
                            {p.categoryLabel}
                          </div>
                        </div>

                        <div className="p-5 flex flex-col gap-3.5">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-xs font-black text-navy-900 group-hover:text-sky-600 transition-colors truncate">
                              {p.title}
                            </h4>
                            <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">{p.description}</p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{p.src}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setIsAddingPhoto(false);
                                  setEditingPhoto(p);
                                }}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePhoto(p.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ==============================================================
                CONTACTS TAB CONTENT
                ============================================================== */}
            {activeTab === "contacts" && db && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Contacts & Corporate Directory</h2>
                    <p className="text-xs text-slate-500">Update site physical coordinates and property facility hotlines.</p>
                  </div>
                  <button
                    onClick={handlePublishContacts}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Directory</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: HQ Address Details */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
                    <h3 className="text-xs font-black uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4.5 h-4.5" />
                      <span>Corporate HQ Coordinates</span>
                    </h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Physical Site Address</label>
                      <textarea
                        value={db.contacts.siteAddress}
                        onChange={(e) => handleUpdateContactDetails("siteAddress", e.target.value)}
                        placeholder="KOHINOOR CITY OFFICE TOWERS, Landmark Ave, Business District, Tower B, Level 18"
                        rows={3}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed font-semibold text-slate-700"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Google Maps Link URL</label>
                      <input
                        type="text"
                        value={db.contacts.siteAddressMapLink}
                        onChange={(e) => handleUpdateContactDetails("siteAddressMapLink", e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700"
                      />
                      {db.contacts.siteAddressMapLink && (
                        <a
                          href={db.contacts.siteAddressMapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-sky-600 font-bold hover:text-sky-700 transition-colors inline-flex items-center gap-1 mt-1 self-start"
                        >
                          <span>Test maps connection link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Contact Managers List */}
                  <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
                        <PhoneCall className="w-4.5 h-4.5" />
                        <span>Administration Directory</span>
                      </h3>
                      <button
                        onClick={handleAddManager}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Manager</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {db.contacts.managers.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs font-bold">
                          No managers listed in directory.
                        </div>
                      ) : (
                        db.contacts.managers.map((mgr) => (
                          <div
                            key={mgr.id}
                            className="p-4 border border-slate-200/60 rounded-2xl flex flex-col gap-4 bg-slate-50/40 relative group/card"
                          >
                            <button
                              onClick={() => handleDeleteManager(mgr.id)}
                              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white border border-slate-200/60 text-slate-400 hover:text-rose-600 opacity-0 group-hover/card:opacity-100 transition-all shadow-sm"
                              title="Remove Contact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase text-slate-400">Full Name</label>
                                <input
                                  type="text"
                                  value={mgr.name}
                                  onChange={(e) => handleUpdateManager(mgr.id, "name", e.target.value)}
                                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-sky-500 bg-white font-bold"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase text-slate-400">Official Role</label>
                                <input
                                  type="text"
                                  value={mgr.role}
                                  onChange={(e) => handleUpdateManager(mgr.id, "role", e.target.value)}
                                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-sky-500 bg-white font-semibold text-slate-700"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase text-slate-400">Phone</label>
                                <input
                                  type="text"
                                  value={mgr.phone}
                                  onChange={(e) => handleUpdateManager(mgr.id, "phone", e.target.value)}
                                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-sky-500 bg-white font-mono text-slate-700"
                                />
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[8px] font-black uppercase text-slate-400">Email Address</label>
                                <input
                                  type="text"
                                  value={mgr.email}
                                  onChange={(e) => handleUpdateManager(mgr.id, "email", e.target.value)}
                                  className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-sky-500 bg-white text-slate-700 truncate"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="text-[8px] font-black uppercase text-slate-400">Visual Theme Badge</label>
                              <div className="flex items-center gap-1.5">
                                {["sky", "emerald", "amber", "rose"].map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleUpdateManager(mgr.id, "colorTheme", color)}
                                    className={`w-4 h-4 rounded-full border transition-all ${
                                      color === "sky"
                                        ? "bg-sky-500"
                                        : color === "emerald"
                                        ? "bg-emerald-500"
                                        : color === "amber"
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    } ${
                                      mgr.colorTheme === color
                                        ? "ring-2 ring-slate-800 scale-110 border-white"
                                        : "border-transparent"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
