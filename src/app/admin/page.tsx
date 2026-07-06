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
  Phone,
  FileText,
  Send,
  Leaf,
  Coffee,
  Menu
} from "lucide-react";
import {
  getDb,
  updateDb,
  loginAction,
  logoutAction,
  checkAuth,
  uploadPhotoAction,
  resendReceiptAction,
  resendEmailReceiptAction,
  updateOrderStatusAction,
  DatabaseSchema,
  EventItem,
  ServiceItem,
  PhotoItem,
  ManagerItem,
  DoctorItem,
  PlantItem,
  CafeMenuItem,
  HealthCheckupCard
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
  const [activeTab, setActiveTab] = useState<"events" | "services" | "photos" | "contacts" | "doctors" | "receipts" | "nursery" | "cafeteria">("events");
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [resendingReceiptId, setResendingReceiptId] = useState<string | null>(null);
  const [resendingEmailReceiptId, setResendingEmailReceiptId] = useState<string | null>(null);
  const [receiptSearchQuery, setReceiptSearchQuery] = useState("");
  const [receiptServiceFilter, setReceiptServiceFilter] = useState<"all" | "Nursery" | "Cafeteria">("all");

  // Nursery states
  const [editingPlant, setEditingPlant] = useState<PlantItem | null>(null);
  const [isAddingPlant, setIsAddingPlant] = useState(false);

  // Cafeteria states
  const [editingCafeItem, setEditingCafeItem] = useState<CafeMenuItem | null>(null);
  const [isAddingCafeItem, setIsAddingCafeItem] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [saving, setSaving] = useState(false);

  // Edit states for modals / forms
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorItem | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Doctor Camp Poster State
  const [cardSocietyName, setCardSocietyName] = useState("");
  const [cardAvailabilityText, setCardAvailabilityText] = useState("");
  const [cardFrequencyText, setCardFrequencyText] = useState("");
  const [cardDaysText, setCardDaysText] = useState("");
  const [cardTimingsText, setCardTimingsText] = useState("");
  const [cardBookingLink, setCardBookingLink] = useState("");
  const [cardFooterText, setCardFooterText] = useState("");
  const [cardDoctorName, setCardDoctorName] = useState("");

  // Synchronize card settings when db changes
  useEffect(() => {
    if (db?.healthCheckupCard) {
      setCardSocietyName(db.healthCheckupCard.societyName || "");
      setCardAvailabilityText(db.healthCheckupCard.availabilityText || "");
      setCardFrequencyText(db.healthCheckupCard.frequencyText || "");
      setCardDaysText(db.healthCheckupCard.daysText || "");
      setCardTimingsText(db.healthCheckupCard.timingsText || "");
      setCardBookingLink(db.healthCheckupCard.bookingLink || "");
      setCardFooterText(db.healthCheckupCard.footerText || "");
      setCardDoctorName(db.healthCheckupCard.doctorName || "");
    }
  }, [db]);

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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, forEdit: "new" | "edit" | "event" | "plant" | "cafe") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    if (forEdit === "event") {
      const filesArray = Array.from(files);
      const remainingSlots = 5 - (editingEvent?.images?.length || 0);
      
      if (remainingSlots <= 0) {
        showToast("error", "Maximum limit of 5 photos reached.");
        setUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const filesToUpload = filesArray.slice(0, remainingSlots);
      showToast("info", `Uploading ${filesToUpload.length} image(s)...`);

      try {
        const uploadPromises = filesToUpload.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await uploadPhotoAction(formData);
          return res;
        });

        const results = await Promise.all(uploadPromises);
        const successfulUrls = results
          .filter((res) => res.success && res.url)
          .map((res) => res.url!);

        const failedCount = results.filter((res) => !res.success).length;

        if (successfulUrls.length > 0) {
          showToast("success", `Uploaded ${successfulUrls.length} image(s) successfully!`);
          setEditingEvent((prev) => {
            if (!prev) return null;
            const currentImages = prev.images || [];
            const combinedImages = [...currentImages, ...successfulUrls].slice(0, 5);
            return {
              ...prev,
              images: combinedImages,
              imageSrc: combinedImages[0] || ""
            };
          });
        }

        if (failedCount > 0) {
          showToast("error", `Failed to upload ${failedCount} image(s).`);
        }
      } catch (err) {
        showToast("error", "Server error during multiple image upload");
      } finally {
        setUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
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
          } else if (forEdit === "edit") {
            setEditingPhoto((prev) => prev ? { ...prev, src: res.url! } : null);
          } else if (forEdit === "plant") {
            setEditingPlant((prev) => prev ? { ...prev, imageSrc: res.url! } : null);
          } else if (forEdit === "cafe") {
            setEditingCafeItem((prev) => prev ? { ...prev, imageSrc: res.url! } : null);
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
  // GALLERY PHOTO 
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
  // DOCTOR OPERATIONS
  // ==========================================
  const handleSaveDoctor = async () => {
    if (!db || !editingDoctor) return;
    if (!editingDoctor.name || !editingDoctor.specialty || !editingDoctor.schedule) {
      showToast("error", "Please fill in all core doctor fields");
      return;
    }

    let updatedDoctors = db.doctors ? [...db.doctors] : [];
    if (isAddingDoctor) {
      updatedDoctors.push({
        ...editingDoctor,
        id: `dr-${Date.now()}`
      });
    } else {
      updatedDoctors = updatedDoctors.map((dr) =>
        dr.id === editingDoctor.id ? editingDoctor : dr
      );
    }

    const success = await saveDatabase({ ...db, doctors: updatedDoctors });
    if (success) {
      setEditingDoctor(null);
      setIsAddingDoctor(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!db) return;
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    const updatedDoctors = (db.doctors || []).filter((dr) => dr.id !== id);
    await saveDatabase({ ...db, doctors: updatedDoctors });
  };

  const handleSaveCardSettings = async () => {
    if (!db) return;
    const updatedDb: DatabaseSchema = {
      ...db,
      healthCheckupCard: {
        societyName: cardSocietyName,
        availabilityText: cardAvailabilityText,
        frequencyText: cardFrequencyText,
        daysText: cardDaysText,
        timingsText: cardTimingsText,
        bookingLink: cardBookingLink,
        footerText: cardFooterText,
        doctorName: cardDoctorName
      }
    };
    const success = await saveDatabase(updatedDb);
    if (success) {
      showToast("success", "Doctor Camp Poster settings published successfully!");
    }
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

  const handleResendReceipt = async (receiptId: string) => {
    setResendingReceiptId(receiptId);
    showToast("info", `Resending WhatsApp receipt for ${receiptId}...`);
    try {
      const res = await resendReceiptAction(receiptId);
      if (res.success) {
        showToast("success", `Receipt ${receiptId} resent successfully!`);
        // Refresh database to get updated logs/status
        const updatedDb = await getDb();
        setDb(updatedDb);
      } else {
        showToast("error", res.error || "Failed to resend receipt.");
      }
    } catch (err) {
      showToast("error", "Server communication failed while resending.");
    } finally {
      setResendingReceiptId(null);
    }
  };

  const handleResendEmailReceipt = async (receiptId: string) => {
    setResendingEmailReceiptId(receiptId);
    showToast("info", `Resending email receipt for ${receiptId}...`);
    try {
      const res = await resendEmailReceiptAction(receiptId);
      if (res.success) {
        showToast("success", `Email receipt ${receiptId} resent successfully!`);
        // Refresh database to get updated logs/status
        const updatedDb = await getDb();
        setDb(updatedDb);
      } else {
        showToast("error", res.error || "Failed to resend email receipt.");
      }
    } catch (err) {
      showToast("error", "Server communication failed while resending email.");
    } finally {
      setResendingEmailReceiptId(null);
    }
  };

  const [updatingOrderStatusId, setUpdatingOrderStatusId] = useState<string | null>(null);

  const handleUpdateOrderStatus = async (receiptId: string, nextStatus: "placed" | "preparing" | "ready" | "completed") => {
    setUpdatingOrderStatusId(receiptId);
    showToast("info", `Updating order status to ${nextStatus.toUpperCase()}...`);
    try {
      const res = await updateOrderStatusAction(receiptId, nextStatus);
      if (res.success) {
        showToast("success", `Order status updated to ${nextStatus.toUpperCase()} successfully!`);
        // Refresh database to get updated logs/status
        const updatedDb = await getDb();
        setDb(updatedDb);
      } else {
        showToast("error", res.error || "Failed to update order status.");
      }
    } catch (err) {
      showToast("error", "Server communication failed while updating status.");
    } finally {
      setUpdatingOrderStatusId(null);
    }
  };

  // Nursery details save
  const handleSaveNurseryDetails = async () => {
    if (!db || !db.nursery) return;
    const success = await saveDatabase(db);
    if (success) {
      showToast("success", "Nursery details saved successfully!");
    }
  };

  // Plant save (add or edit)
  const handleSavePlant = async () => {
    if (!db || !db.nursery || !editingPlant) return;
    if (!editingPlant.name || !editingPlant.description || editingPlant.price <= 0 || editingPlant.quantity < 0) {
      showToast("error", "Please fill in all plant fields correctly.");
      return;
    }

    let updatedPlants = [...db.nursery.plants];
    if (isAddingPlant) {
      updatedPlants.push({
        ...editingPlant,
        id: `plant-${Date.now()}`
      });
    } else {
      updatedPlants = updatedPlants.map((p) =>
        p.id === editingPlant.id ? editingPlant : p
      );
    }

    const success = await saveDatabase({
      ...db,
      nursery: {
        ...db.nursery,
        plants: updatedPlants
      }
    });

    if (success) {
      setEditingPlant(null);
      setIsAddingPlant(false);
      showToast("success", "Plant details published successfully!");
    }
  };

  // Plant delete
  const handleDeletePlant = async (id: string) => {
    if (!db || !db.nursery) return;
    if (!confirm("Are you sure you want to delete this plant?")) return;

    const updatedPlants = db.nursery.plants.filter((p) => p.id !== id);
    const success = await saveDatabase({
      ...db,
      nursery: {
        ...db.nursery,
        plants: updatedPlants
      }
    });
    if (success) {
      showToast("success", "Plant deleted successfully!");
    }
  };

  // Cafeteria details save
  const handleSaveCafeteriaDetails = async () => {
    if (!db || !db.cafeteria) return;
    const success = await saveDatabase(db);
    if (success) {
      showToast("success", "Cafeteria details saved successfully!");
    }
  };

  // Cafe item save (add or edit)
  const handleSaveCafeItem = async () => {
    if (!db || !db.cafeteria || !editingCafeItem) return;
    if (!editingCafeItem.name || !editingCafeItem.description || editingCafeItem.price <= 0 || editingCafeItem.quantity < 0) {
      showToast("error", "Please fill in all menu item fields correctly.");
      return;
    }

    let updatedMenu = [...db.cafeteria.menu];
    if (isAddingCafeItem) {
      updatedMenu.push({
        ...editingCafeItem,
        id: `cafe-${Date.now()}`
      });
    } else {
      updatedMenu = updatedMenu.map((item) =>
        item.id === editingCafeItem.id ? editingCafeItem : item
      );
    }

    const success = await saveDatabase({
      ...db,
      cafeteria: {
        ...db.cafeteria,
        menu: updatedMenu
      }
    });

    if (success) {
      setEditingCafeItem(null);
      setIsAddingCafeItem(false);
      showToast("success", "Menu item published successfully!");
    }
  };

  // Cafe item delete
  const handleDeleteCafeItem = async (id: string) => {
    if (!db || !db.cafeteria) return;
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    const updatedMenu = db.cafeteria.menu.filter((item) => item.id !== id);
    const success = await saveDatabase({
      ...db,
      cafeteria: {
        ...db.cafeteria,
        menu: updatedMenu
      }
    });
    if (success) {
      showToast("success", "Menu item deleted successfully!");
    }
  };

  // Render Spinner during load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-navy-900 flex-col gap-4">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Admin System...</span>
      </div>
    );
  }

  // Render Login screen if not logged in
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
        {/* Glow bubbles */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="relative max-w-md w-full bg-white border border-slate-200 p-10 rounded-[32px] shadow-xl flex flex-col items-center text-center gap-6"
        >
          {/* Logo Icon */}
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Kohinoor Logo"
              className="h-full w-full object-contain p-1.5"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight leading-none">
              Kohinoor Commercial II
            </h1>
            <span className="text-[10px] text-sky-600 font-extrabold uppercase tracking-widest">
              Administrative Gateway
            </span>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed max-w-[280px]">
            Please enter your administrative access password to manage events, services, photos, and directory contacts.
          </p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-left text-xs font-semibold"
              >
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submittingLogin}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 disabled:cursor-wait"
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
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-slate-50 text-navy-900 font-sans">
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
      <header className="z-40 bg-[#0f172a] text-white py-2.5 md:py-3 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-md relative">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="md:hidden p-1.5 -ml-1.5 text-slate-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="hidden md:flex w-7 h-7 md:w-8 md:h-8 rounded bg-white items-center justify-center p-1 shrink-0">
            <img src="/images/logo.png" alt="Kohinoor Logo" className="h-full w-full object-contain" />
          </div>
          <span className="text-[14px] md:text-[15px] font-semibold tracking-tight truncate max-w-[150px] md:max-w-none">
            Kohinoor Towers
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {saving && (
            <span className="text-[10px] md:text-xs text-sky-400 font-bold flex items-center gap-1.5 md:mr-4">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden md:inline">Saving...</span>
            </span>
          )}
          <span className="hidden sm:inline text-[13px] font-medium text-slate-300">Welcome, Admin</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-all text-[12px] md:text-[13px] font-medium"
          >
            <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-950/40 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 2. BODY CONTENT PANEL */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        
        {/* Left Panel Sidebar */}
        <aside className={`absolute md:relative z-40 w-64 md:w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-full overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          <div className="flex flex-col p-4 gap-1">
            <div className="md:hidden flex items-center gap-3 mb-6 px-2">
              <div className="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center p-1 shrink-0">
                <img src="/images/logo.png" alt="Kohinoor Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-[14px] font-bold text-navy-900 tracking-tight">
                Kohinoor Towers
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              MENU
            </span>
            {[
              { id: "events", label: "Community Events", icon: Calendar },
              { id: "services", label: "Healthcare & Services", icon: Plus },
              { id: "doctors", label: "Visiting Doctors", icon: Heart },
              { id: "photos", label: "Interactive Gallery", icon: ImageIcon },
              { id: "contacts", label: "Contacts & Directory", icon: PhoneCall },
              { id: "nursery", label: "Plant Nursery", icon: Leaf },
              { id: "cafeteria", label: "Cafeteria Menu", icon: Coffee },
              { id: "receipts", label: "Receipts & WhatsApp Logs", icon: FileText },
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
                    setEditingDoctor(null);
                    setIsAddingDoctor(false);
                    setEditingPlant(null);
                    setIsAddingPlant(false);
                    setEditingCafeItem(null);
                    setIsAddingCafeItem(false);
                    // Close mobile menu
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all ${
                    isSelected
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-slate-50 text-slate-600 font-medium"
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  <span className="text-[13px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 mt-auto">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-[13px]">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Need Help?
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Refer to the user guide or contact support.
              </p>
              <a href="#" className="text-[11px] text-blue-600 font-semibold hover:underline mt-1">
                View User Guide
              </a>
            </div>
          </div>
        </aside>

        {/* Right Panel Main Data Dashboard */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 md:p-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-5 md:gap-6">
            
            {/* ==============================================================
                EVENTS TAB CONTENT
                ============================================================== */}
            {activeTab === "events" && db && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Community Events</h2>
                    <p className="text-[12px] md:text-[13px] text-slate-500">Manage celebrations, camps, and corporate challenges.</p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                    <button
                      onClick={handleLogout}
                      className="flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[12px] md:text-[13px] font-medium hover:bg-slate-50 transition-colors text-center"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingEvent(true);
                        setEditingEvent({
                          id: "",
                          title: "",
                          desc: "",
                          iconName: "Calendar",
                          imageSrc: "",
                          images: [],
                          highlights: []
                        });
                      }}
                      className="flex-1 md:flex-none flex justify-center items-center gap-1.5 px-3 md:px-4 py-2.5 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] md:text-[13px] font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>Add Event</span>
                    </button>
                  </div>
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

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Title</label>
                      <input
                        type="text"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        placeholder="e.g. Annual Blood Donation Drive"
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description (About This Event)</label>
                      <textarea
                        value={editingEvent.desc}
                        onChange={(e) => setEditingEvent({ ...editingEvent, desc: e.target.value })}
                        placeholder="Detailed brief describing the purpose, timing, and coordinate layout of the event..."
                        rows={3}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Highlights (Comma-separated)</label>
                      <input
                        type="text"
                        value={editingEvent.highlights ? editingEvent.highlights.join(", ") : ""}
                        onChange={(e) => setEditingEvent({ ...editingEvent, highlights: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                        placeholder="e.g. Free Entry, Family Friendly, Live Performances"
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                      />
                    </div>

                    {/* Event Photos Manager (Optional, Max 5) */}
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Event Photos (Optional, Max 5)
                      </label>
                      
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, "event")}
                        className="hidden"
                        id="event-file-upload"
                      />

                      {/* Display grid of current photos */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {(editingEvent.images || []).map((img, i) => (
                          <div key={i} className="aspect-[16/10] w-full border border-slate-200 bg-slate-100 rounded-2xl overflow-hidden relative group">
                            <img
                              src={img}
                              alt={`Event photo ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = (editingEvent.images || []).filter((_, idx) => idx !== i);
                                setEditingEvent({
                                  ...editingEvent,
                                  images: newImages,
                                  imageSrc: newImages[0] || ""
                                });
                              }}
                              className="absolute inset-0 bg-navy-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <div className="p-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </div>
                            </button>
                          </div>
                        ))}

                        {/* Visual upload card - only show if less than 5 images */}
                        {(editingEvent.images || []).length < 5 && (
                          <div
                            onClick={() => document.getElementById("event-file-upload")?.click()}
                            className="border-2 border-dashed border-slate-200 hover:border-sky-400 hover:bg-sky-500/5 rounded-2xl aspect-[16/10] text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 bg-slate-50/50"
                          >
                            {uploadingImage ? (
                              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                            ) : (
                              <Upload className="w-5 h-5 text-sky-500" />
                            )}
                            <span className="text-[10px] font-bold text-navy-900">Upload Photo</span>
                            <span className="text-[8px] text-slate-400">{(editingEvent.images || []).length}/5 uploaded</span>
                          </div>
                        )}
                      </div>

                      {/* Manual Image URL Appending */}
                      {(editingEvent.images || []).length < 5 && (
                        <div className="flex flex-col gap-2 p-4 border border-slate-200 rounded-2xl bg-white mt-2">
                          <label className="text-[9px] font-bold uppercase text-slate-400">Or append a web image link</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id="event-manual-url-input"
                              placeholder="Paste URL e.g. https://images.unsplash.com/..."
                              className="px-4.5 py-2.5 border border-slate-200 rounded-xl text-xs flex-grow focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const val = e.currentTarget.value.trim();
                                  if (val) {
                                    const currentImages = editingEvent.images || [];
                                    const newImages = [...currentImages, val];
                                    setEditingEvent({
                                      ...editingEvent,
                                      images: newImages,
                                      imageSrc: newImages[0]
                                    });
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById("event-manual-url-input") as HTMLInputElement;
                                const val = input?.value.trim();
                                if (val) {
                                  const currentImages = editingEvent.images || [];
                                  const newImages = [...currentImages, val];
                                  setEditingEvent({
                                    ...editingEvent,
                                    images: newImages,
                                    imageSrc: newImages[0]
                                  });
                                  input.value = "";
                                }
                              }}
                              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors"
                            >
                              Add URL
                            </button>
                          </div>
                        </div>
                      )}
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
                <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  {db.events.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-[13px] font-medium">
                      No events currently listed.
                    </div>
                  ) : (
                    db.events.map((evt, idx) => (
                      <div
                        key={evt.id}
                        className={`p-4 md:p-5 flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6 hover:bg-slate-50/50 transition-colors ${
                          idx !== db.events.length - 1 ? 'border-b border-slate-100' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3 md:gap-5 w-full">
                          {evt.images && evt.images.length > 0 ? (
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden border border-slate-200 shrink-0 relative bg-slate-50 shadow-sm flex items-center justify-center">
                              <img src={evt.images[0]} alt={evt.title} className="w-full h-full object-cover" />
                              {evt.images.length > 1 && (
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-navy-950/80 border border-white/10 text-[7px] font-bold text-white leading-none">
                                  {evt.images.length} Photos
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-sky-500 border border-white rounded-full flex items-center justify-center text-white p-1">
                                <IconPreview name={evt.iconName} className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[2.5]" />
                              </div>
                            </div>
                          ) : evt.imageSrc ? (
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden border border-slate-200 shrink-0 relative bg-slate-50 shadow-sm flex items-center justify-center">
                              <img src={evt.imageSrc} alt={evt.title} className="w-full h-full object-cover" />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-sky-500 border border-white rounded-full flex items-center justify-center text-white p-1">
                                <IconPreview name={evt.iconName} className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[2.5]" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-500/5 border border-sky-400/20 rounded-2xl flex items-center justify-center shrink-0 text-sky-500">
                              <IconPreview name={evt.iconName} className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 stroke-[2]" />
                            </div>
                          )}
                          <div className="flex flex-col gap-1 md:gap-1.5">
                            <h4 className="text-[13px] md:text-sm font-extrabold text-navy-900 group-hover:text-sky-600 transition-colors leading-snug">
                              {evt.title}
                            </h4>
                            <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed max-w-2xl">{evt.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end w-full md:w-auto gap-2 shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-100 md:border-0">
                          <button
                            onClick={() => {
                              setIsAddingEvent(false);
                              setEditingEvent(evt);
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] md:text-[12px] font-medium text-slate-600 hover:bg-slate-50 transition-colors flex-1 md:flex-none text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] md:text-[12px] font-medium text-rose-600 hover:bg-rose-50 border-rose-100 transition-colors flex-1 md:flex-none text-center"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[8px]">i</span>
                  Tip: Keep event descriptions clear and include timings.
                </p>
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
                    <div className="col-span-2 text-center py-12 bg-white border border-slate-200 p-8 rounded-2xl text-slate-400 text-xs font-bold shadow-sm">
                      No services currently listed. Click "Add Service" to create one!
                    </div>
                  ) : (
                    db.services.map((svc) => (
                      <div
                        key={svc.id}
                        className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-5 hover:border-slate-300 transition-all duration-200 group relative"
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

            {activeTab === "doctors" && db && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Visiting Doctors & Specialists</h2>
                    <p className="text-xs text-slate-500">Manage names, schedules, contact details, and booking redirects.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingDoctor(true);
                      setEditingDoctor({
                        id: "",
                        name: "Dr. New Doctor",
                        specialty: "General Wellness",
                        schedule: "Visiting Hours",
                        phone: "",
                        email: "",
                        avatarColor: "bg-sky-500/10 text-sky-600 border-sky-400/20",
                        bookingLink: ""
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Doctor</span>
                  </button>
                </div>

                {/* Doctor Camp Poster Settings Form */}
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
                  <h3 className="text-xs font-black uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
                    <Settings className="w-4.5 h-4.5" />
                    <span>Doctor Camp Poster Card Settings</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Society/Center Name</label>
                      <input
                        type="text"
                        value={cardSocietyName}
                        onChange={(e) => setCardSocietyName(e.target.value)}
                        placeholder="Society Title at top of card"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Availability Text</label>
                      <input
                        type="text"
                        value={cardAvailabilityText}
                        onChange={(e) => setCardAvailabilityText(e.target.value)}
                        placeholder="Availability Message (e.g. DOCTOR)"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Frequency Text</label>
                      <input
                        type="text"
                        value={cardFrequencyText}
                        onChange={(e) => setCardFrequencyText(e.target.value)}
                        placeholder="Left column frequency (e.g. EVERY MONTH)"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Days Text</label>
                      <input
                        type="text"
                        value={cardDaysText}
                        onChange={(e) => setCardDaysText(e.target.value)}
                        placeholder="Right column days (e.g. 2ND & 4TH WEDNESDAY)"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Timings Range</label>
                      <input
                        type="text"
                        value={cardTimingsText}
                        onChange={(e) => setCardTimingsText(e.target.value)}
                        placeholder="Timing strip text (e.g. 12.00 pm - 02.00 pm)"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Booking Link URL (for Button & QR Code)</label>
                      <input
                        type="text"
                        value={cardBookingLink}
                        onChange={(e) => setCardBookingLink(e.target.value)}
                        placeholder="e.g. https://docs.google.com/forms/..."
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold text-slate-700 font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Doctor's Name (Displayed below Button)</label>
                      <input
                        type="text"
                        value={cardDoctorName}
                        onChange={(e) => setCardDoctorName(e.target.value)}
                        placeholder="e.g. Dr. Reshma Nikam"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold text-slate-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Footer Badge Text</label>
                      <input
                        type="text"
                        value={cardFooterText}
                        onChange={(e) => setCardFooterText(e.target.value)}
                        placeholder="e.g. Your health is our priority"
                        className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveCardSettings}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/10 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Card Settings</span>
                    </button>
                  </div>
                </div>

                {/* Doctor Form (Add/Edit) */}
                {editingDoctor && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-sky-300 p-8 rounded-3xl shadow-md flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-sky-600 flex items-center gap-2">
                        {isAddingDoctor ? <Plus className="w-4.5 h-4.5" /> : <Edit className="w-4.5 h-4.5" />}
                        <span>{isAddingDoctor ? "Add New Doctor" : "Edit Doctor Details"}</span>
                      </h3>
                      <button
                        onClick={() => {
                          setEditingDoctor(null);
                          setIsAddingDoctor(false);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                        <input
                          type="text"
                          value={editingDoctor.name}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                          placeholder="e.g. Dr. Amit Verma"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Specialty / Qualification</label>
                        <input
                          type="text"
                          value={editingDoctor.specialty}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                          placeholder="e.g. M.D. General Medicine"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Visiting Schedule</label>
                        <input
                          type="text"
                          value={editingDoctor.schedule}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, schedule: e.target.value })}
                          placeholder="e.g. 12:00 PM - 2:00 PM (Only 2nd & 4th Week of Wednesday)"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Booking Form URL (Optional)</label>
                        <input
                          type="text"
                          value={editingDoctor.bookingLink || ""}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, bookingLink: e.target.value })}
                          placeholder="e.g. https://docs.google.com/forms/..."
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Phone (Optional)</label>
                        <input
                          type="text"
                          value={editingDoctor.phone || ""}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                          placeholder="e.g. +918657902810"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Email (Optional)</label>
                        <input
                          type="text"
                          value={editingDoctor.email || ""}
                          onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                          placeholder="e.g. dr.amit.verma@kohinoorcommercial2.in"
                          className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Card Theme Style</label>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { label: "Sky / Blue Theme", value: "bg-sky-500/10 text-sky-600 border-sky-400/20" },
                          { label: "Rose / Red Theme", value: "bg-rose-500/10 text-rose-600 border-rose-400/20" },
                          { label: "Emerald / Green Theme", value: "bg-emerald-500/10 text-emerald-600 border-emerald-400/20" },
                          { label: "Amber / Orange Theme", value: "bg-amber-500/10 text-amber-600 border-amber-400/20" }
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setEditingDoctor({ ...editingDoctor, avatarColor: opt.value })}
                            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                              editingDoctor.avatarColor === opt.value
                                ? "border-sky-500 bg-sky-50 text-sky-700 shadow-sm"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDoctor(null);
                          setIsAddingDoctor(false);
                        }}
                        className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDoctor}
                        className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Publish Doctor</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Doctors List Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(db.doctors || []).map((dr) => (
                    <div
                      key={dr.id}
                      className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow relative group/card"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 font-bold ${dr.avatarColor}`}>
                          <LucideIcons.Stethoscope className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-extrabold text-navy-900 leading-tight">{dr.name}</h4>
                          <span className="text-[10px] font-bold text-sky-600 tracking-wider uppercase leading-none">{dr.specialty}</span>
                          
                          <div className="flex flex-col gap-1.5 mt-3 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-700">{dr.schedule}</span>
                            </div>
                            {dr.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-mono text-slate-600">{dr.phone}</span>
                              </div>
                            )}
                            {dr.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-600 truncate max-w-[180px]">{dr.email}</span>
                              </div>
                            )}
                            {dr.bookingLink && (
                              <div className="flex items-center gap-2 text-sky-600">
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <a href={dr.bookingLink} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline truncate max-w-[180px]">
                                  Form Link
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsAddingDoctor(false);
                            setEditingDoctor(dr);
                          }}
                          className="flex-grow flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(dr.id)}
                          className="flex-grow flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-rose-100 hover:bg-rose-50 text-xs font-bold text-rose-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(db.doctors || []).length === 0 && (
                    <div className="col-span-full text-center py-12 border border-dashed border-slate-200 rounded-3xl bg-white text-slate-400 text-xs font-bold">
                      No doctors currently registered in database.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "receipts" && db && (
              <div className="flex flex-col gap-6">
                <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Receipts & Email Delivery</h2>
                    <p className="text-xs text-slate-500">Track occupant service orders, view email receipt statuses, and trigger manual delivery retries.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={receiptSearchQuery}
                      onChange={(e) => setReceiptSearchQuery(e.target.value)}
                      placeholder="Search Customer, Email, Phone, ID..."
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 bg-slate-50 text-slate-700 min-w-[220px]"
                    />
                    <select
                      value={receiptServiceFilter}
                      onChange={(e) => setReceiptServiceFilter(e.target.value as any)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-sky-500 bg-slate-50 text-slate-700"
                    >
                      <option value="all">All Services</option>
                      <option value="Nursery">Nursery</option>
                      <option value="Cafeteria">Cafeteria</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Receipts List */}
                  <div className={`bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-5 ${selectedReceiptId ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
                    {(() => {
                      const ordersList = db.orders || [];
                      const filteredOrders = ordersList.filter((order) => {
                        if (receiptServiceFilter !== "all" && order.serviceType !== receiptServiceFilter) {
                          return false;
                        }
                        if (receiptSearchQuery.trim()) {
                          const query = receiptSearchQuery.toLowerCase();
                          const nameMatch = order.customerName.toLowerCase().includes(query);
                          const emailMatch = order.customerEmail.toLowerCase().includes(query);
                          const phoneMatch = order.customerPhone.includes(query);
                          const receiptMatch = order.receiptNumber.toLowerCase().includes(query);
                          const orderIdMatch = order.orderId.toLowerCase().includes(query);
                          return nameMatch || emailMatch || phoneMatch || receiptMatch || orderIdMatch;
                        }
                        return true;
                      });

                      return (
                        <>
                          <h3 className="text-xs font-black uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
                            <FileText className="w-4.5 h-4.5" />
                            <span>Order Receipts History ({filteredOrders.length})</span>
                          </h3>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                  <th className="pb-3 pr-2">Receipt ID</th>
                                  <th className="pb-3 pr-2">Customer</th>
                                  <th className="pb-3 pr-2">Service</th>
                                  <th className="pb-3 pr-2 text-right">Total</th>
                                  <th className="pb-3 pr-2 text-center">Email Status</th>
                                  <th className="pb-3 text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredOrders.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">
                                      No purchase receipts found matching criteria.
                                    </td>
                                  </tr>
                                ) : (
                                  [...filteredOrders]
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map((order) => {
                                      const log = db.receiptLogs?.find((l) => l.receiptId === order.receiptNumber);
                                      const emailStatus = log?.emailStatus || "pending";
                                      const isSelected = selectedReceiptId === order.receiptNumber;
                                      return (
                                        <tr 
                                          key={order.receiptNumber} 
                                          className={`border-b border-slate-100/60 hover:bg-slate-50/50 transition-all cursor-pointer ${isSelected ? 'bg-sky-50/30' : ''}`}
                                          onClick={() => setSelectedReceiptId(order.receiptNumber === selectedReceiptId ? null : order.receiptNumber)}
                                        >
                                          <td className="py-3.5 pr-2 font-mono font-bold text-slate-700">
                                            {order.receiptNumber}
                                            <span className="block text-[10px] text-slate-400 font-normal font-sans mt-0.5">
                                              {new Date(order.createdAt).toLocaleString()}
                                            </span>
                                          </td>
                                          <td className="py-3.5 pr-2">
                                            <span className="font-semibold text-slate-800 block leading-tight">{order.customerName}</span>
                                            <span className="text-slate-500 font-mono text-[10px]">{order.customerPhone}</span>
                                          </td>
                                          <td className="py-3.5 pr-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                              order.serviceType === "Nursery" 
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                                : "bg-amber-50 text-amber-700 border border-amber-100"
                                            }`}>
                                              {order.serviceType}
                                            </span>
                                          </td>
                                          <td className="py-3.5 pr-2 text-right font-black text-slate-900">
                                            ₹{order.amount}
                                          </td>
                                          <td className="py-3.5 pr-2 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                              emailStatus === "sent" 
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                : emailStatus === "failed"
                                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                : "bg-slate-50 text-slate-600 border border-slate-200"
                                            }`}>
                                              {emailStatus === "sent" && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                                              {emailStatus === "failed" && <AlertCircle className="w-3 h-3 text-rose-600" />}
                                              {emailStatus === "pending" && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
                                              <span className="capitalize">{emailStatus}</span>
                                            </span>
                                          </td>
                                          <td className="py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1.5">
                                              <a 
                                                href={`/receipt/${order.receiptNumber}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-navy-900 shadow-sm transition-all"
                                                title="View Secure Portal"
                                              >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                              </a>
                                              <a 
                                                href={`/api/receipts/${order.receiptNumber}/pdf`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-navy-900 shadow-sm transition-all"
                                                title="Download PDF"
                                              >
                                                <FileText className="w-3.5 h-3.5" />
                                              </a>
                                              <button
                                                onClick={() => handleResendEmailReceipt(order.receiptNumber)}
                                                disabled={resendingEmailReceiptId === order.receiptNumber}
                                                className={`p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-navy-900 shadow-sm transition-all ${
                                                  resendingEmailReceiptId === order.receiptNumber ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                title="Resend Email"
                                              >
                                                {resendingEmailReceiptId === order.receiptNumber ? (
                                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                                ) : (
                                                  <Mail className="w-3.5 h-3.5" />
                                                )}
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Right Column: Selected Receipt Details & Email Logs */}
                  {selectedReceiptId && (() => {
                    const order = db.orders?.find(o => o.receiptNumber === selectedReceiptId);
                    if (!order) return null;
                    const log = db.receiptLogs?.find(l => l.receiptId === order.receiptNumber);
                    return (
                      <div className="lg:col-span-5 bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-6 sticky top-24">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                          <div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Selected Receipt</span>
                            <h3 className="text-base font-black text-navy-900 font-mono leading-none mt-1">{order.receiptNumber}</h3>
                          </div>
                          <button 
                            onClick={() => setSelectedReceiptId(null)}
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customer Information */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer Details</h4>
                          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500 font-medium">Name:</span>
                              <span className="font-semibold text-slate-800">{order.customerName}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500 font-medium">Phone Number:</span>
                              <span className="font-mono font-semibold text-slate-800">{order.customerPhone}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500 font-medium">Email Address:</span>
                              <span className="font-semibold text-slate-800">{order.customerEmail}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500 font-medium">Order Date:</span>
                              <span className="font-semibold text-slate-800">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500 font-medium">Order ID:</span>
                              <span className="font-mono text-slate-600">{order.orderId}</span>
                            </div>
                            <div className="flex justify-between text-xs border-t border-slate-100 pt-2">
                              <span className="text-slate-500 font-medium">Receipt PDF:</span>
                              <a 
                                href={`/api/receipts/${order.receiptNumber}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:text-sky-700 font-bold underline"
                              >
                                View / Download PDF
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Ordered Items */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Line Items</h4>
                          <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-bold text-slate-500 grid grid-cols-12">
                              <span className="col-span-6">Item</span>
                              <span className="col-span-2 text-center">Qty</span>
                              <span className="col-span-4 text-right">Price</span>
                            </div>
                            <div className="divide-y divide-slate-100 max-h-[150px] overflow-y-auto">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="px-4 py-2.5 grid grid-cols-12 text-slate-700 font-medium">
                                  <span className="col-span-6 truncate font-semibold">{item.name}</span>
                                  <span className="col-span-2 text-center text-slate-500">{item.quantity}</span>
                                  <span className="col-span-4 text-right font-bold">₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <div className="bg-sky-50/30 px-4 py-3 border-t border-slate-100 font-black text-slate-900 flex justify-between items-center">
                              <span>Total Paid:</span>
                              <span>₹{order.amount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Order Status (Zomato/Swiggy style) */}
                        <div className="flex flex-col gap-2">
                          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Order Status (Swiggy / Zomato)</h4>
                          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Current Status:</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.orderStatus === "completed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : order.orderStatus === "ready"
                                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                                  : order.orderStatus === "preparing"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {order.orderStatus || "placed"}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Update Status:</span>
                              <div className="grid grid-cols-4 gap-1.5">
                                {["placed", "preparing", "ready", "completed"].map((st) => (
                                  <button
                                    key={st}
                                    onClick={() => handleUpdateOrderStatus(order.receiptNumber, st as any)}
                                    disabled={updatingOrderStatusId === order.receiptNumber}
                                    className={`py-2 rounded-lg text-[8.5px] font-black uppercase tracking-wider transition-all border text-center ${
                                      (order.orderStatus || "placed") === st
                                        ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                                        : "bg-white text-slate-650 border-slate-200 hover:bg-slate-50 cursor-pointer"
                                    }`}
                                  >
                                    {st === "placed" ? "Confirm" : st === "preparing" ? "Cook" : st === "ready" ? "Ready" : "Done"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Email Delivery Logs */}
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Dispatch Status</h4>
                            <button
                              onClick={() => handleResendEmailReceipt(order.receiptNumber)}
                              disabled={resendingEmailReceiptId === order.receiptNumber}
                              className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold shadow-md shadow-blue-500/10 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              {resendingEmailReceiptId === order.receiptNumber ? (
                                <Loader2 className="w-3 animate-spin text-white" />
                              ) : (
                                <Mail className="w-3 h-3 text-white" />
                              )}
                              <span>Send Receipt</span>
                            </button>
                          </div>
                          <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Email Status:</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log?.emailStatus === "sent"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : log?.emailStatus === "failed"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-slate-50 text-slate-600 border border-slate-200"
                              }`}>
                                <span className="capitalize">{log?.emailStatus || "Pending"}</span>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Last Attempt:</span>
                              <span className="font-semibold text-slate-800 font-mono">
                                {log?.emailSentAt ? new Date(log.emailSentAt).toLocaleString() : "Never"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-medium">Total Retries:</span>
                              <span className="font-semibold text-slate-850 font-mono">{log?.resendCount || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === "nursery" && db && db.nursery && (
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Plant Nursery Management</h2>
                    <p className="text-xs text-slate-500">Edit Nursery contact info, description, and manage the plant catalog.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingPlant(true);
                      setEditingPlant({
                        id: "",
                        name: "",
                        description: "",
                        price: 0,
                        imageSrc: "/images/snake_plant.png",
                        quantity: 10
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Plant</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Nursery Configuration Details */}
                  <div className="lg:col-span-4 bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
                    <h3 className="text-xs font-black uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4.5 h-4.5" />
                      <span>Nursery Details</span>
                    </h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                      <textarea
                        value={db.nursery.description}
                        onChange={(e) => {
                          const updatedNursery = { ...db.nursery!, description: e.target.value };
                          setDb({ ...db, nursery: updatedNursery });
                        }}
                        rows={4}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Location</label>
                      <input
                        type="text"
                        value={db.nursery.location}
                        onChange={(e) => {
                          const updatedNursery = { ...db.nursery!, location: e.target.value };
                          setDb({ ...db, nursery: updatedNursery });
                        }}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Timings</label>
                      <input
                        type="text"
                        value={db.nursery.timing}
                        onChange={(e) => {
                          const updatedNursery = { ...db.nursery!, timing: e.target.value };
                          setDb({ ...db, nursery: updatedNursery });
                        }}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Phone</label>
                      <input
                        type="text"
                        value={db.nursery.contact}
                        onChange={(e) => {
                          const updatedNursery = { ...db.nursery!, contact: e.target.value };
                          setDb({ ...db, nursery: updatedNursery });
                        }}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <button
                      onClick={handleSaveNurseryDetails}
                      className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publish Details</span>
                    </button>
                  </div>

                  {/* Right Column: Plants Grid Catalog */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Plant Catalog Editor Form */}
                    {editingPlant && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-sky-300 p-6 rounded-3xl shadow-md flex flex-col gap-5"
                      >
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                            {isAddingPlant ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                            <span>{isAddingPlant ? "Add Catalog Plant" : "Edit Plant Details"}</span>
                          </h3>
                          <button
                            onClick={() => {
                              setEditingPlant(null);
                              setIsAddingPlant(false);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Plant Name</label>
                            <input
                              type="text"
                              value={editingPlant.name}
                              onChange={(e) => setEditingPlant({ ...editingPlant, name: e.target.value })}
                              placeholder="e.g. Ficus Bonsai"
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Price (₹)</label>
                            <input
                              type="number"
                              value={editingPlant.price}
                              onChange={(e) => setEditingPlant({ ...editingPlant, price: Number(e.target.value) })}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Stock Quantity</label>
                            <input
                              type="number"
                              value={editingPlant.quantity}
                              onChange={(e) => setEditingPlant({ ...editingPlant, quantity: Number(e.target.value) })}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image Link URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingPlant.imageSrc}
                                onChange={(e) => setEditingPlant({ ...editingPlant, imageSrc: e.target.value })}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs flex-grow focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "plant")}
                                className="hidden"
                                id="plant-image-upload"
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById("plant-image-upload")?.click()}
                                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors"
                              >
                                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <span>Upload</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                          <textarea
                            value={editingPlant.description}
                            onChange={(e) => setEditingPlant({ ...editingPlant, description: e.target.value })}
                            rows={3}
                            placeholder="Detailed plant instructions and care brief..."
                            className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed text-slate-700 font-semibold"
                          />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPlant(null);
                              setIsAddingPlant(false);
                            }}
                            className="px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-500 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSavePlant}
                            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Plant</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Plants Listing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {db.nursery.plants.map((plant) => (
                        <div
                          key={plant.id}
                          className="bg-white border border-slate-200/50 p-4 rounded-3xl shadow-sm flex gap-4 hover:border-emerald-300 transition-all duration-300 relative group/plant"
                        >
                          <div className="w-20 h-20 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 shrink-0 relative">
                            <img src={plant.imageSrc} alt={plant.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex flex-col justify-between flex-grow min-w-0">
                            <div>
                              <h4 className="text-xs font-black text-navy-900 truncate leading-snug">{plant.name}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-2 mt-0.5">{plant.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-extrabold text-emerald-600">₹{plant.price}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                plant.quantity > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}>
                                {plant.quantity > 0 ? `${plant.quantity} in stock` : "Out of stock"}
                              </span>
                            </div>
                          </div>

                          {/* Edit / Delete Buttons Overlay */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/plant:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setIsAddingPlant(false);
                                setEditingPlant(plant);
                              }}
                              className="p-1.5 rounded-lg bg-white border border-slate-200/60 text-slate-400 hover:text-sky-600 shadow-sm transition-colors"
                              title="Edit Plant"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlant(plant.id)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200/60 text-slate-400 hover:text-rose-600 shadow-sm transition-colors"
                              title="Delete Plant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cafeteria" && db && db.cafeteria && (
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-black text-navy-900 leading-none">Cafeteria Menu Management</h2>
                    <p className="text-xs text-slate-500">Edit Cafeteria physical details, location info, and configure breakfast / lunch thalis.</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingCafeItem(true);
                      setEditingCafeItem({
                        id: "",
                        name: "",
                        category: "Drinks",
                        description: "",
                        price: 0,
                        imageSrc: "/images/coffee.png",
                        quantity: 50
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/15 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Menu Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Cafeteria configuration coordinates */}
                  <div className="lg:col-span-4 bg-white border border-slate-200/50 p-6 rounded-3xl shadow-sm flex flex-col gap-5">
                    <h3 className="text-xs font-black uppercase text-sky-600 tracking-wider flex items-center gap-1.5">
                      <Settings className="w-4.5 h-4.5" />
                      <span>Cafeteria Settings</span>
                    </h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                      <textarea
                        value={db.cafeteria.description}
                        onChange={(e) => {
                          const updatedCafe = { ...db.cafeteria!, description: e.target.value };
                          setDb({ ...db, cafeteria: updatedCafe });
                        }}
                        rows={4}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Location</label>
                      <input
                        type="text"
                        value={db.cafeteria.location}
                        onChange={(e) => {
                          const updatedCafe = { ...db.cafeteria!, location: e.target.value };
                          setDb({ ...db, cafeteria: updatedCafe });
                        }}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Timings</label>
                      <input
                        type="text"
                        value={db.cafeteria.timing}
                        onChange={(e) => {
                          const updatedCafe = { ...db.cafeteria!, timing: e.target.value };
                          setDb({ ...db, cafeteria: updatedCafe });
                        }}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Phone</label>
                      <input
                        type="text"
                        value={db.cafeteria.contact}
                        onChange={(e) => {
                          const updatedCafe = { ...db.cafeteria!, contact: e.target.value };
                          setDb({ ...db, cafeteria: updatedCafe });
                        }}
                        className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <button
                      onClick={handleSaveCafeteriaDetails}
                      className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Publish Details</span>
                    </button>
                  </div>

                  {/* Right Column: Menu Grid Catalog */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {/* Cafe Item Editor Form */}
                    {editingCafeItem && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-sky-300 p-6 rounded-3xl shadow-md flex flex-col gap-5"
                      >
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                            {isAddingCafeItem ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                            <span>{isAddingCafeItem ? "Add Menu Item" : "Edit Menu Item Details"}</span>
                          </h3>
                          <button
                            onClick={() => {
                              setEditingCafeItem(null);
                              setIsAddingCafeItem(false);
                            }}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Item Name</label>
                            <input
                              type="text"
                              value={editingCafeItem.name}
                              onChange={(e) => setEditingCafeItem({ ...editingCafeItem, name: e.target.value })}
                              placeholder="e.g. Masala Dosa"
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</label>
                            <select
                              value={editingCafeItem.category}
                              onChange={(e) => setEditingCafeItem({ ...editingCafeItem, category: e.target.value as any })}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold text-slate-700"
                            >
                              <option value="Drinks">Drinks</option>
                              <option value="Breakfast">Breakfast</option>
                              <option value="Lunch">Lunch</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Price (₹)</label>
                            <input
                              type="number"
                              value={editingCafeItem.price}
                              onChange={(e) => setEditingCafeItem({ ...editingCafeItem, price: Number(e.target.value) })}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Daily Stock Quantity</label>
                            <input
                              type="number"
                              value={editingCafeItem.quantity}
                              onChange={(e) => setEditingCafeItem({ ...editingCafeItem, quantity: Number(e.target.value) })}
                              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 font-semibold"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image Link URL</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingCafeItem.imageSrc}
                                onChange={(e) => setEditingCafeItem({ ...editingCafeItem, imageSrc: e.target.value })}
                                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs flex-grow focus:outline-none focus:border-sky-500 bg-slate-50/50 text-slate-700 font-semibold"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "cafe")}
                                className="hidden"
                                id="cafe-image-upload"
                              />
                              <button
                                type="button"
                                onClick={() => document.getElementById("cafe-image-upload")?.click()}
                                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors"
                              >
                                {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <span>Upload</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                          <textarea
                            value={editingCafeItem.description}
                            onChange={(e) => setEditingCafeItem({ ...editingCafeItem, description: e.target.value })}
                            rows={3}
                            placeholder="Detailed taste ingredients brief..."
                            className="px-4.5 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-sky-500 bg-slate-50/50 resize-none leading-relaxed text-slate-700 font-semibold"
                          />
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCafeItem(null);
                              setIsAddingCafeItem(false);
                            }}
                            className="px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-500 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveCafeItem}
                            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md shadow-sky-500/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Item</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Cafe Menu Listing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {db.cafeteria.menu.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200/50 p-4 rounded-3xl shadow-sm flex gap-4 hover:border-amber-300 transition-all duration-300 relative group/cafe"
                        >
                          <div className="w-20 h-20 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 shrink-0 relative">
                            <img src={item.imageSrc} alt={item.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex flex-col justify-between flex-grow min-w-0">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-black text-navy-900 truncate leading-snug">{item.name}</h4>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                                  item.category === "Drinks" 
                                    ? "bg-sky-50 text-sky-700 border border-sky-100" 
                                    : item.category === "Breakfast"
                                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                                    : "bg-rose-50 text-rose-700 border border-rose-100"
                                }`}>
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-2 mt-1">{item.description}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-extrabold text-amber-600">₹{item.price}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                item.quantity > 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}>
                                {item.quantity > 0 ? `${item.quantity} in stock` : "Out of stock"}
                              </span>
                            </div>
                          </div>

                          {/* Edit / Delete Buttons Overlay */}
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/cafe:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setIsAddingCafeItem(false);
                                setEditingCafeItem(item);
                              }}
                              className="p-1.5 rounded-lg bg-white border border-slate-200/60 text-slate-400 hover:text-sky-600 shadow-sm transition-colors"
                              title="Edit Menu Item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCafeItem(item.id)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200/60 text-slate-400 hover:text-rose-600 shadow-sm transition-colors"
                              title="Delete Menu Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
