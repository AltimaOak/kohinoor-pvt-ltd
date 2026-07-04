 "use server";

import fs from "fs/promises";
import path from "path";
import { cookies, headers } from "next/headers";
import { generateReceiptPdfBuffer } from "./utils/receiptGenerator";
import { sendReceiptEmail, sendSellerOrderNotification } from "./utils/emailSender";
import { sendWhatsAppReceipt, sendWhatsAppMessage } from "./utils/whatsAppSender";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Password hashing is not strictly required for local default, but env password or fallback
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kohinoor-admin";
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TOKEN = "authenticated-admin-session-token";

// Twilio WhatsApp Integration Helper
async function sendTwilioWhatsApp(to: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  if (!accountSid || !authToken || accountSid.startsWith("ACXXXXXX")) {
    console.log("[TWILIO GATEWAY] Credentials missing or placeholder. Running in simulated console mode.");
    return { success: false, error: "Twilio credentials missing or not configured." };
  }

  const cleanTo = to.replace(/[^0-9]/g, "");
  // Prepend country code 91 if phone is 10 digits
  const formattedTo = cleanTo.length === 10 ? `91${cleanTo}` : cleanTo;

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const params = new URLSearchParams();
    params.append("To", `whatsapp:+${formattedTo}`);
    params.append("From", from.startsWith("whatsapp:") ? from : `whatsapp:${from}`);
    params.append("Body", message);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[TWILIO SUCCESS] Real WhatsApp receipt sent to +${formattedTo}. SID: ${data.sid}`);
      return { success: true, sid: data.sid };
    } else {
      console.error(`[TWILIO GATEWAY FAILURE] Failed to send WhatsApp message: ${data.message}`);
      return { success: false, error: data.message };
    }
  } catch (err) {
    console.error("[TWILIO CONNECTION ERROR] Failed to connect to Twilio API:", err);
    return { success: false, error: "Failed to connect to Twilio API service." };
  }
}

export interface EventItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
  imageSrc?: string;
  images?: string[];
  highlights?: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  iconName: string;
  glowColor: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: "exterior" | "interior" | "lounge" | "amenities";
  categoryLabel: string;
  src: string;
  description: string;
}

export interface ManagerItem {
  id: string;
  name: string;
  role: string;
  category: string;
  phone: string;
  email: string;
  colorTheme: string;
}

export interface ContactsData {
  siteAddress: string;
  siteAddressMapLink: string;
  managers: ManagerItem[];
}

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  schedule: string;
  phone?: string;
  email?: string;
  avatarColor: string;
  bookingLink?: string;
}

export interface BookingItem {
  id: string;
  doctorId: string;
  doctorName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  time: string;
  message: string;
  createdAt: string;
}

export interface PlantItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  quantity: number;
}

export interface PlantOrder {
  id: string;
  plantId: string;
  plantName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  quantity: number;
  totalPrice: number;
  deliveryMethod: "pickup" | "delivery";
  officeUnit?: string;
  status: "pending" | "completed";
  createdAt: string;
  receiptId?: string;
}

export interface NurserySchema {
  description: string;
  location: string;
  timing: string;
  contact: string;
  plants: PlantItem[];
  orders: PlantOrder[];
}

export interface CafeMenuItem {
  id: string;
  name: string;
  category: "Drinks" | "Breakfast" | "Lunch";
  description: string;
  price: number;
  imageSrc: string;
  quantity: number;
}

export interface CafeOrder {
  id: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  status: "pending" | "completed";
  createdAt: string;
  receiptId?: string;
}

export interface CafeteriaSchema {
  description: string;
  location: string;
  timing: string;
  contact: string;
  menu: CafeMenuItem[];
  orders: CafeOrder[];
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: "Nursery" | "Cafeteria";
  items: OrderItem[];
  amount: number;
  transactionId: string;
  paymentStatus: "pending" | "completed" | "failed";
  receiptNumber: string;
  createdAt: string;
  orderStatus?: "placed" | "preparing" | "ready" | "completed";
}

export interface ReceiptLog {
  receiptId: string;
  orderId: string;
  emailStatus: "pending" | "sent" | "failed";
  emailSentAt: string | null;
  resendCount: number;
}

export interface Receipt {
  id: string; // receiptNumber
  orderId: string;
  serviceType: "Nursery" | "Cafeteria";
  date: string; // createdAt
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmountPaid: number; // amount
  paymentStatus: "completed" | "pending";
  paymentMethod: string;
  pdfUrl?: string;
  emailSentStatus?: "sent" | "failed" | "pending";
  emailSentTimestamp?: string;
  whatsAppSentStatus?: string;
  whatsAppSentTimestamp?: string;
  whatsAppMessageId?: string;
  whatsAppDeliveryLogs?: any[];
}

export interface HealthCheckupCard {
  societyName: string;
  availabilityText: string;
  frequencyText: string;
  daysText: string;
  timingsText: string;
  bookingLink: string;
  footerText: string;
  doctorName?: string;
}

export interface DatabaseSchema {
  events: EventItem[];
  services: ServiceItem[];
  photos: PhotoItem[];
  contacts: ContactsData;
  doctors?: DoctorItem[];
  bookings?: BookingItem[];
  nursery?: NurserySchema;
  cafeteria?: CafeteriaSchema;
  receipts?: Receipt[];
  orders?: Order[];
  receiptLogs?: ReceiptLog[];
  healthCheckupCard?: HealthCheckupCard;
}

// Ensure database file exists
async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    // If db.json doesn't exist, create it with empty structure
    const initialData: DatabaseSchema = {
      events: [],
      services: [],
      photos: [],
      contacts: {
        siteAddress: "",
        siteAddressMapLink: "",
        managers: [],
      },
      doctors: [],
      bookings: [],
      nursery: {
        description: "Lush green oasis within the Kohinoor complex offering a wide selection of indoor and outdoor plants to brighten your workspace and improve air quality.",
        location: "Ground Floor, Tower B Plaza Area",
        timing: "9:00 AM - 6:00 PM (Monday - Saturday)",
        contact: "+91 8657902809",
        plants: [
          {
            id: "plant-snake",
            name: "Snake Plant (Sansevieria)",
            description: "A popular low-maintenance indoor plant known for its air-purifying qualities and structural beauty.",
            price: 250,
            imageSrc: "/images/snake_plant.png",
            quantity: 20
          },
          {
            id: "plant-areca",
            name: "Areca Palm",
            description: "Beautiful feathery fronds that add a tropical touch to corporate cabins and lobbies.",
            price: 350,
            imageSrc: "/images/areca_palm.png",
            quantity: 15
          },
          {
            id: "plant-peace",
            name: "Peace Lily",
            description: "Features dark green leaves and brilliant white spathes, ideal for low-light office desks.",
            price: 180,
            imageSrc: "/images/peace_lily.png",
            quantity: 10
          }
        ],
        orders: []
      },
      cafeteria: {
        description: "Premium corporate cafeteria offering freshly brewed hot beverages, delicious breakfast selections, and corporate lunch thalis.",
        location: "Ground Floor, Tower A Plaza Area",
        timing: "8:00 AM - 8:30 PM (Monday - Saturday)",
        contact: "+91 8657902811",
        menu: [
          {
            id: "cafe-coffee",
            name: "Cappuccino / Filter Coffee",
            category: "Drinks",
            description: "Freshly brewed premium espresso with textured milk, or authentic South Indian filter coffee.",
            price: 80,
            imageSrc: "/images/coffee.png",
            quantity: 100
          },
          {
            id: "cafe-tea",
            name: "Adrak Masala Chai",
            category: "Drinks",
            description: "Traditional hot tea brewed with fresh ginger, cardamom, and premium tea leaves.",
            price: 50,
            imageSrc: "/images/tea.png",
            quantity: 100
          },
          {
            id: "cafe-sandwich",
            name: "Classic Club Sandwich",
            category: "Breakfast",
            description: "Triple-layered toasted bread with crisp veggies, cheese, and seasoned herb spread.",
            price: 120,
            imageSrc: "/images/sandwich.png",
            quantity: 50
          },
          {
            id: "cafe-poha",
            name: "Indori Kanda Poha",
            category: "Breakfast",
            description: "Flattened rice tempered with mustard, curry leaves, roasted peanuts, onion, and topped with sev.",
            price: 70,
            imageSrc: "/images/poha.png",
            quantity: 60
          },
          {
            id: "cafe-thali",
            name: "Executive Veg Thali",
            category: "Lunch",
            description: "A premium lunch containing Paneer Subzi, Dal Tadka, Seasonal Dry Veg, Roti, Rice, Papad, Raita, and Sweet.",
            price: 220,
            imageSrc: "/images/thali.png",
            quantity: 40
          },
          {
            id: "cafe-friedrice",
            name: "Schezwan Veg Fried Rice",
            category: "Lunch",
            description: "Spicy wok-tossed long grain rice with finely chopped farm-fresh vegetables and Schezwan sauce.",
            price: 150,
            imageSrc: "/images/friedrice.png",
            quantity: 50
          }
        ],
        orders: []
      },
      receipts: [],
      healthCheckupCard: {
        societyName: "Kohinoor City Office Towers Industrial Estate and Premises Co-op Society Ltd",
        availabilityText: "DOCTOR",
        frequencyText: "EVERY MONTH",
        daysText: "2ND & 4TH WEDNESDAY",
        timingsText: "12.00 pm - 02.00 pm",
        bookingLink: "https://docs.google.com/forms/d/e/1FAIpQLSfjv_Ie_0LPzeMBiFArfdcsh6bJG2raICoITfB3Ca02oCIMtQ/viewform",
        footerText: "Your health is our priority",
        doctorName: "Dr. Reshma Nikam"
      }
    };
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

// Get raw DB contents
export async function getDb(): Promise<DatabaseSchema> {
  await ensureDbExists();
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(data) as DatabaseSchema;

    // Auto-migrate if nursery is missing
    if (!db.nursery) {
      db.nursery = {
        description: "Lush green oasis within the Kohinoor complex offering a wide selection of indoor and outdoor plants to brighten your workspace and improve air quality.",
        location: "Ground Floor, Tower B Plaza Area",
        timing: "9:00 AM - 6:00 PM (Monday - Saturday)",
        contact: "+91 8657902809",
        plants: [
          {
            id: "plant-snake",
            name: "Snake Plant (Sansevieria)",
            description: "A popular low-maintenance indoor plant known for its air-purifying qualities and structural beauty.",
            price: 250,
            imageSrc: "/images/snake_plant.png",
            quantity: 20
          },
          {
            id: "plant-areca",
            name: "Areca Palm",
            description: "Beautiful feathery fronds that add a tropical touch to corporate cabins and lobbies.",
            price: 350,
            imageSrc: "/images/areca_palm.png",
            quantity: 15
          },
          {
            id: "plant-peace",
            name: "Peace Lily",
            description: "Features dark green leaves and brilliant white spathes, ideal for low-light office desks.",
            price: 180,
            imageSrc: "/images/peace_lily.png",
            quantity: 10
          }
        ],
        orders: []
      };
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    }

    // Auto-migrate if cafeteria is missing
    if (!db.cafeteria) {
      db.cafeteria = {
        description: "Premium corporate cafeteria offering freshly brewed hot beverages, delicious breakfast selections, and corporate lunch thalis.",
        location: "Ground Floor, Tower A Plaza Area",
        timing: "8:00 AM - 8:30 PM (Monday - Saturday)",
        contact: "+91 8657902811",
        menu: [
          {
            id: "cafe-coffee",
            name: "Cappuccino / Filter Coffee",
            category: "Drinks",
            description: "Freshly brewed premium espresso with textured milk, or authentic South Indian filter coffee.",
            price: 80,
            imageSrc: "/images/coffee.png",
            quantity: 100
          },
          {
            id: "cafe-tea",
            name: "Adrak Masala Chai",
            category: "Drinks",
            description: "Traditional hot tea brewed with fresh ginger, cardamom, and premium tea leaves.",
            price: 50,
            imageSrc: "/images/tea.png",
            quantity: 100
          },
          {
            id: "cafe-sandwich",
            name: "Classic Club Sandwich",
            category: "Breakfast",
            description: "Triple-layered toasted bread with crisp veggies, cheese, and seasoned herb spread.",
            price: 120,
            imageSrc: "/images/sandwich.png",
            quantity: 50
          },
          {
            id: "cafe-poha",
            name: "Indori Kanda Poha",
            category: "Breakfast",
            description: "Flattened rice tempered with mustard, curry leaves, roasted peanuts, onion, and topped with sev.",
            price: 70,
            imageSrc: "/images/poha.png",
            quantity: 60
          },
          {
            id: "cafe-thali",
            name: "Executive Veg Thali",
            category: "Lunch",
            description: "A premium lunch containing Paneer Subzi, Dal Tadka, Seasonal Dry Veg, Roti, Rice, Papad, Raita, and Sweet.",
            price: 220,
            imageSrc: "/images/thali.png",
            quantity: 40
          },
          {
            id: "cafe-friedrice",
            name: "Schezwan Veg Fried Rice",
            category: "Lunch",
            description: "Spicy wok-tossed long grain rice with finely chopped farm-fresh vegetables and Schezwan sauce.",
            price: 150,
            imageSrc: "/images/friedrice.png",
            quantity: 50
          }
        ],
        orders: []
      };
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    }

    // Auto-migrate if receipts is missing
    if (!db.receipts) {
      db.receipts = [];
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    }

    // Auto-migrate if orders or receiptLogs are missing
    let hasUpdates = false;
    if (!db.orders) {
      db.orders = [];
      hasUpdates = true;
    }
    if (!db.receiptLogs) {
      db.receiptLogs = [];
      hasUpdates = true;
    }

    // If there are existing receipts but no orders, migrate them
    if (db.receipts.length > 0 && db.orders.length === 0) {
      for (const receipt of db.receipts) {
        db.orders.push({
          orderId: receipt.orderId,
          customerName: receipt.customerName,
          customerEmail: receipt.customerEmail || "",
          customerPhone: receipt.customerPhone,
          serviceType: receipt.serviceType,
          items: receipt.items,
          amount: receipt.totalAmountPaid,
          transactionId: receipt.orderId, // fallback
          paymentStatus: receipt.paymentStatus === "completed" ? "completed" : "pending",
          receiptNumber: receipt.id,
          createdAt: receipt.date,
        });

        db.receiptLogs.push({
          receiptId: receipt.id,
          orderId: receipt.orderId,
          emailStatus: receipt.emailSentStatus === "sent" ? "sent" : (receipt.emailSentStatus === "failed" ? "failed" : "pending"),
          emailSentAt: receipt.emailSentTimestamp || null,
          resendCount: 1,
        });
      }
      hasUpdates = true;
    }

    if (!db.healthCheckupCard) {
      db.healthCheckupCard = {
        societyName: "Kohinoor City Office Towers Industrial Estate and Premises Co-op Society Ltd",
        availabilityText: "DOCTOR",
        frequencyText: "EVERY MONTH",
        daysText: "2ND & 4TH WEDNESDAY",
        timingsText: "12.00 pm - 02.00 pm",
        bookingLink: "https://docs.google.com/forms/d/e/1FAIpQLSfjv_Ie_0LPzeMBiFArfdcsh6bJG2raICoITfB3Ca02oCIMtQ/viewform",
        footerText: "Your health is our priority",
        doctorName: "Dr. Reshma Nikam"
      };
      hasUpdates = true;
    } else if (db.healthCheckupCard && !db.healthCheckupCard.hasOwnProperty("doctorName")) {
      db.healthCheckupCard.doctorName = "Dr. Reshma Nikam";
      hasUpdates = true;
    }

    if (hasUpdates) {
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    }

    return db;
  } catch (error) {
    console.error("Error reading database:", error);
    throw new Error("Failed to read database");
  }
}

// Check authentication status
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === SESSION_TOKEN;
}

// Update DB contents (authenticated)
export async function updateDb(data: DatabaseSchema): Promise<{ success: boolean; error?: string }> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
  } catch (error) {
    console.error("Error writing database:", error);
    return { success: false, error: "Failed to write data to database" };
  }
}

// Admin login action
export async function loginAction(password: string): Promise<{ success: boolean; error?: string }> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: SESSION_TOKEN,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect password" };
}

// Admin logout action
export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

// Admin photo upload action
export async function uploadPhotoAction(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return { success: false, error: "Unauthorized access" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  // Verify file is an image
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Uploaded file must be an image" };
  }

  try {
    // Ensure uploads directory exists
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    // Generate unique file name
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${safeName}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      url: `/uploads/${filename}`,
    };
  } catch (error) {
    console.error("Error during file upload:", error);
    return { success: false, error: "Failed to save uploaded file" };
  }
}

// Appointment Booking server action
export async function bookAppointmentAction(booking: Omit<BookingItem, "id" | "createdAt">): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    const newBooking: BookingItem = {
      ...booking,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    if (!db.bookings) {
      db.bookings = [];
    }
    db.bookings.push(newBooking);
    
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    
    const doctor = db.doctors?.find(d => d.id === booking.doctorId);
    const doctorEmail = doctor ? doctor.email : "clinic@kohinoorcommercial2.in";
    
    // Simulate sending email to doctor, both building managers & occupant
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Outgoing Mail`);
    console.log(`To Doctor: ${booking.doctorName} <${doctorEmail}>`);
    console.log(`To Property Manager: Devendra Sali <devendra.sali@kohinoorcommercial2.in>`);
    console.log(`To Security Manager: Roshan Patil <roshan.patil@kohinoorcommercial2.in>`);
    console.log(`Cc Occupant: ${booking.userName} <${booking.userEmail}>`);
    console.log(`Subject: Confirmed Appointment Request - ${booking.userName}`);
    console.log(`Body:\nDear Doctor and Managers,\n\nYou have a new medical appointment scheduled.\n\nDetails:\n- Occupant: ${booking.userName}\n- Phone: ${booking.userPhone}\n- Email: ${booking.userEmail}\n- Date: ${booking.date}\n- Time: ${booking.time}\n- Reason/Notes: ${booking.message}\n\nThis is a system-generated request dispatched via the Kohinoor Services Hub.`);
    console.log(`========================================\n`);

    return { success: true };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Failed to submit booking" };
  }
}

// Plant purchase server action
export async function buyPlantAction(order: Omit<PlantOrder, "id" | "createdAt" | "status">): Promise<{ success: boolean; orderId?: string; receiptId?: string; whatsAppSentStatus?: string; emailSentStatus?: string; pdfUrl?: string; error?: string }> {
  try {
    const db = await getDb();
    if (!db.nursery) {
      return { success: false, error: "Nursery module is not initialized." };
    }

    const plantIndex = db.nursery.plants.findIndex(p => p.id === order.plantId);
    if (plantIndex === -1) {
      return { success: false, error: "Plant not found in our catalog." };
    }

    const plant = db.nursery.plants[plantIndex];
    if (plant.quantity < order.quantity) {
      return { success: false, error: `Insufficient stock. Only ${plant.quantity} items available.` };
    }

    // Decrement stock
    plant.quantity -= order.quantity;

    // Create order item
    const orderId = `ord-${Date.now()}`;
    const receiptId = `REC-${Date.now()}`;

    const newOrder: PlantOrder = {
      ...order,
      deliveryMethod: "pickup", // Hardcoded to pickup
      officeUnit: undefined,
      id: orderId,
      status: "pending",
      createdAt: new Date().toISOString(),
      receiptId: receiptId,
    };

    if (!db.nursery.orders) {
      db.nursery.orders = [];
    }
    db.nursery.orders.push(newOrder);

    // Generate E-Receipt
    const newReceipt: any = {
      id: receiptId,
      orderId: orderId,
      serviceType: "Nursery",
      date: newOrder.createdAt,
      customerName: order.userName,
      customerPhone: order.userPhone,
      customerEmail: order.userEmail,
      items: [
        {
          itemId: order.plantId,
          name: order.plantName,
          price: plant.price,
          quantity: order.quantity
        }
      ],
      totalAmountPaid: order.totalPrice,
      paymentStatus: "completed",
      paymentMethod: "Card / Online",
      whatsAppSentStatus: "pending",
      whatsAppDeliveryLogs: []
    };

    // Generate PDF Receipt
    let pdfBuffer: Buffer | null = null;
    let pdfUrl = "";
    try {
      pdfBuffer = await generateReceiptPdfBuffer(newReceipt as any);
      
      // Save it to disk for static public receipt access
      const receiptsDir = path.join(process.cwd(), "public", "uploads", "receipts");
      await fs.mkdir(receiptsDir, { recursive: true });
      const filename = `Kohinoor_Receipt_${newReceipt.id}.pdf`;
      const filePath = path.join(receiptsDir, filename);
      await fs.writeFile(filePath, pdfBuffer);
      pdfUrl = `/uploads/receipts/${filename}`;
      newReceipt.pdfUrl = pdfUrl;
    } catch (pdfErr) {
      console.error("[PDF GENERATION ERROR] Failed to generate e-receipt PDF:", pdfErr);
    }

    // Determine host and absolute URL
    let absolutePdfUrl = "";
    if (pdfUrl) {
      let host = "localhost:3000";
      try {
        host = (await headers()).get("host") || "localhost:3000";
      } catch (e) {
        // Fallback
      }
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      absolutePdfUrl = `${protocol}://${host}${pdfUrl}`;
    }

    // Dispatch Receipt Email with the generated PDF Buffer
    if (pdfBuffer && order.userEmail) {
      const emailRes = await sendReceiptEmail(newReceipt as any, pdfBuffer, order.userEmail);
      newReceipt.emailSentStatus = emailRes.success ? "sent" : "failed";
      const emailLog = {
        timestamp: new Date().toISOString(),
        status: emailRes.success ? ("success" as const) : ("failure" as const),
        error: emailRes.error
      };
      newReceipt.emailDeliveryLogs = [emailLog];
      if (emailRes.success) {
        newReceipt.emailSentTimestamp = emailLog.timestamp;
      }
    } else {
      newReceipt.emailSentStatus = "failed";
      newReceipt.emailDeliveryLogs = [{
        timestamp: new Date().toISOString(),
        status: "failure" as const,
        error: !pdfBuffer ? "PDF buffer was not generated" : "No customer email provided"
      }];
    }

    // Trigger official WhatsApp Document delivery
    const waRes = await sendWhatsAppReceipt(newReceipt as any, order.userPhone);
    
    // Log Delivery
    const logEntry = {
      timestamp: new Date().toISOString(),
      status: waRes.success ? ("success" as const) : ("failure" as const),
      error: waRes.error
    };
    newReceipt.whatsAppDeliveryLogs = [logEntry];
    newReceipt.whatsAppSentStatus = waRes.success ? "sent" : "failed";
    newReceipt.whatsAppSentTimestamp = logEntry.timestamp;
    newReceipt.whatsAppMessageId = waRes.messageId;

    if (!db.receipts) {
      db.receipts = [];
    }
    db.receipts.push(newReceipt);

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Trigger WhatsApp notification to the Seller (Nursery Contact)
    try {
      const sellerPhone = db.nursery.contact || "+91 9372025677";
      const sellerMessage = `*Kohinoor Nursery - New Order Received* 🌿

Dear Seller,

A new plant order has been placed successfully.

*Order Details:*
• *Receipt Number:* ${receiptId}
• *Order ID:* ${orderId}
• *Plant Name:* ${order.plantName}
• *Quantity:* ${order.quantity}
• *Total Amount Paid:* ₹${order.totalPrice}

*Buyer Details:*
• *Name:* ${order.userName}
• *Phone:* ${order.userPhone}
• *Email:* ${order.userEmail || "N/A"}

Please prepare the order for pickup. The customer will bring their receipt confirmation.

---
_Kohinoor Facilities Automation_`;

      await sendWhatsAppMessage(sellerPhone, sellerMessage);
    } catch (waErr) {
      console.error("[SELLER NOTIFICATION ERROR] Failed to send WhatsApp notification to seller:", waErr);
    }

    // Trigger Email notification to the Seller (Nursery Manager)
    try {
      await sendSellerOrderNotification({
        id: orderId,
        receiptId: receiptId,
        plantName: order.plantName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        userName: order.userName,
        userPhone: order.userPhone,
        userEmail: order.userEmail
      }, "nursery@kohinoorcommercial2.in");
    } catch (mailErr) {
      console.error("[SELLER NOTIFICATION ERROR] Failed to send Email notification to seller:", mailErr);
    }

    // Asynchronously trigger background retry worker for any failed receipts
    Promise.resolve().then(() => retryFailedWhatsAppSends());

    // Simulate sending email to nursery manager, both building managers & purchaser
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Nursery Order Received`);
    console.log(`To Nursery Manager: nursery@kohinoorcommercial2.in`);
    console.log(`To Property Manager: Devendra Sali <devendra.sali@kohinoorcommercial2.in>`);
    console.log(`To Security Manager: Roshan Patil <roshan.patil@kohinoorcommercial2.in>`);
    console.log(`Cc Purchaser: ${order.userName} <${order.userEmail}>`);
    console.log(`Subject: New Plant Purchase Confirmation - Order #${newOrder.id}`);
    console.log(`Body:\nDear Nursery Team and Managers,\n\nA new plant purchase order has been submitted.\n\nOrder Details:\n- Order ID: ${newOrder.id}\n- Plant Name: ${newOrder.plantName}\n- Quantity: ${newOrder.quantity}\n- Total Price: ₹${newOrder.totalPrice}\n- Purchaser: ${order.userName}\n- Contact: ${order.userPhone}\n- Email: ${order.userEmail}\n- Delivery Method: Self-Pickup\n\nPlease prepare the order for handoff.\n\nBest Regards,\nKohinoor Facility Hub`);
    console.log(`========================================\n`);

    // Keep console log simulation for visibility
    console.log(`\n========================================`);
    console.log(`[WHATSAPP DISPATCH] Outgoing PDF receipt WhatsApp message triggered to ${order.userPhone}`);
    console.log(`PDF URL: ${newReceipt.pdfUrl}`);
    console.log(`========================================\n`);

    return { success: true, orderId, receiptId, whatsAppSentStatus: newReceipt.whatsAppSentStatus, emailSentStatus: newReceipt.emailSentStatus, pdfUrl: newReceipt.pdfUrl };
  } catch (error) {
    console.error("Error creating nursery purchase order:", error);
    return { success: false, error: "Failed to process plant purchase" };
  }
}

// Cafeteria purchase server action
export async function buyCafeteriaAction(order: Omit<CafeOrder, "id" | "createdAt" | "status">): Promise<{ success: boolean; orderId?: string; receiptId?: string; whatsAppSentStatus?: string; emailSentStatus?: string; pdfUrl?: string; error?: string }> {
  try {
    const db = await getDb();
    if (!db.cafeteria) {
      return { success: false, error: "Cafeteria module is not initialized." };
    }

    // Validate and decrement stock for each item ordered
    for (const orderItem of order.items) {
      const menuItemIndex = db.cafeteria.menu.findIndex(item => item.id === orderItem.itemId);
      if (menuItemIndex === -1) {
        return { success: false, error: `Menu item ${orderItem.name} not found.` };
      }
      const menuItem = db.cafeteria.menu[menuItemIndex];
      if (menuItem.quantity < orderItem.quantity) {
        return { success: false, error: `Insufficient stock for ${orderItem.name}. Only ${menuItem.quantity} items available.` };
      }
      menuItem.quantity -= orderItem.quantity;
    }

    const orderId = `cafe-${Date.now()}`;
    const receiptId = `REC-${Date.now()}`;

    const newOrder: CafeOrder = {
      ...order,
      id: orderId,
      status: "pending",
      createdAt: new Date().toISOString(),
      receiptId: receiptId
    };

    if (!db.cafeteria.orders) {
      db.cafeteria.orders = [];
    }
    db.cafeteria.orders.push(newOrder);

    // Generate E-Receipt
    const newReceipt: any = {
      id: receiptId,
      orderId: orderId,
      serviceType: "Cafeteria",
      date: newOrder.createdAt,
      customerName: order.userName,
      customerPhone: order.userPhone,
      customerEmail: order.userEmail,
      items: order.items.map(item => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmountPaid: order.totalPrice,
      paymentStatus: "completed",
      paymentMethod: "Card / Online",
      whatsAppSentStatus: "pending",
      whatsAppDeliveryLogs: []
    };

    // Generate PDF Receipt
    let pdfBuffer: Buffer | null = null;
    let pdfUrl = "";
    try {
      pdfBuffer = await generateReceiptPdfBuffer(newReceipt as any);
      
      // Save it to disk for static public receipt access
      const receiptsDir = path.join(process.cwd(), "public", "uploads", "receipts");
      await fs.mkdir(receiptsDir, { recursive: true });
      const filename = `Kohinoor_Receipt_${newReceipt.id}.pdf`;
      const filePath = path.join(receiptsDir, filename);
      await fs.writeFile(filePath, pdfBuffer);
      pdfUrl = `/uploads/receipts/${filename}`;
      newReceipt.pdfUrl = pdfUrl;
    } catch (pdfErr) {
      console.error("[PDF GENERATION ERROR] Failed to generate e-receipt PDF:", pdfErr);
    }

    // Determine host and absolute URL
    let absolutePdfUrl = "";
    if (pdfUrl) {
      let host = "localhost:3000";
      try {
        host = (await headers()).get("host") || "localhost:3000";
      } catch (e) {
        // Fallback
      }
      const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
      absolutePdfUrl = `${protocol}://${host}${pdfUrl}`;
    }

    // Dispatch Receipt Email with the generated PDF Buffer
    if (pdfBuffer && order.userEmail) {
      const emailRes = await sendReceiptEmail(newReceipt as any, pdfBuffer, order.userEmail);
      newReceipt.emailSentStatus = emailRes.success ? "sent" : "failed";
      const emailLog = {
        timestamp: new Date().toISOString(),
        status: emailRes.success ? ("success" as const) : ("failure" as const),
        error: emailRes.error
      };
      newReceipt.emailDeliveryLogs = [emailLog];
      if (emailRes.success) {
        newReceipt.emailSentTimestamp = emailLog.timestamp;
      }
    } else {
      newReceipt.emailSentStatus = "failed";
      newReceipt.emailDeliveryLogs = [{
        timestamp: new Date().toISOString(),
        status: "failure" as const,
        error: !pdfBuffer ? "PDF buffer was not generated" : "No customer email provided"
      }];
    }

    // Trigger official WhatsApp Document delivery
    const waRes = await sendWhatsAppReceipt(newReceipt as any, order.userPhone);
    
    // Log Customer Delivery
    const customerLogEntry = {
      timestamp: new Date().toISOString(),
      status: waRes.success ? ("success" as const) : ("failure" as const),
      error: waRes.error
    };
    newReceipt.whatsAppDeliveryLogs = [customerLogEntry];
    newReceipt.whatsAppSentStatus = waRes.success ? "sent" : "failed";
    newReceipt.whatsAppSentTimestamp = customerLogEntry.timestamp;
    newReceipt.whatsAppMessageId = waRes.messageId;

    if (!db.receipts) {
      db.receipts = [];
    }
    db.receipts.push(newReceipt);

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Asynchronously trigger background retry worker for any failed receipts
    Promise.resolve().then(() => retryFailedWhatsAppSends());

    // Simulate sending email to Cafeteria Manager, both building managers & Purchaser
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Cafeteria Order Received`);
    console.log(`To Cafeteria Manager: cafeteria@kohinoorcommercial2.in`);
    console.log(`To Property Manager: Devendra Sali <devendra.sali@kohinoorcommercial2.in>`);
    console.log(`To Security Manager: Roshan Patil <roshan.patil@kohinoorcommercial2.in>`);
    console.log(`Cc Purchaser: ${order.userName} <${order.userEmail}>`);
    console.log(`Subject: New Cafeteria Order Confirmation - Order #${newOrder.id}`);
    console.log(`Body:\nDear Cafeteria Team and Managers,\n\nA new food & beverage order has been submitted.\n\nOrder Details:\n- Order ID: ${newOrder.id}\n- Purchaser: ${order.userName}\n- Contact: ${order.userPhone}\n- Email: ${order.userEmail}\n- Total Price: ₹${newOrder.totalPrice}\n\nItems Ordered:\n${order.items.map(item => `- ${item.name} x ${item.quantity} (₹${item.price * item.quantity})`).join('\n')}\n\nPlease prepare the order for self-pickup.\n\nBest Regards,\nKohinoor Facility Hub`);
    console.log(`========================================\n`);

    // Console log for server-side visibility
    console.log(`\n========================================`);
    console.log(`[WHATSAPP DISPATCH] Outgoing PDF receipt WhatsApp message triggered to ${order.userPhone}`);
    console.log(`PDF URL: ${newReceipt.pdfUrl}`);
    console.log(`========================================\n`);

    return { success: true, orderId, receiptId, whatsAppSentStatus: newReceipt.whatsAppSentStatus, emailSentStatus: newReceipt.emailSentStatus, pdfUrl: newReceipt.pdfUrl };
  } catch (error) {
    console.error("Error creating cafeteria order:", error);
    return { success: false, error: "Failed to process cafeteria order" };
  }
}

// Resend receipt action (redirects to resendEmailReceiptAction since WhatsApp is disabled)
export async function resendReceiptAction(receiptId: string): Promise<{ success: boolean; error?: string }> {
  return resendEmailReceiptAction(receiptId);
}

/**
 * Background worker to automatically retry failed or pending Email receipt sends.
 */
export async function retryFailedWhatsAppSends(): Promise<void> {
  try {
    const db = await getDb();
    if (!db.orders || !db.receiptLogs) return;

    let updatedAny = false;

    // Filter receipt logs that are failed or pending
    const failedLogs = db.receiptLogs.filter(
      l => l.emailStatus === "failed" || l.emailStatus === "pending"
    );

    if (failedLogs.length > 0) {
      console.log(`[AUTO-RETRY WORKER] Found ${failedLogs.length} failed/pending Email receipt deliveries. Attempting automatic retries...`);
      for (const log of failedLogs) {
        const order = db.orders.find(o => o.receiptNumber === log.receiptId);
        if (!order || !order.customerEmail) continue;

        try {
          const pdfBuffer = await generateReceiptPdfBuffer(order);
          const emailRes = await sendReceiptEmail(order, pdfBuffer, order.customerEmail);

          log.emailStatus = emailRes.success ? "sent" : "failed";
          log.resendCount += 1;
          if (emailRes.success) {
            log.emailSentAt = new Date().toISOString();
            console.log(`[AUTO-RETRY WORKER SUCCESS] Auto-sent Email receipt ${order.receiptNumber} successfully.`);
          } else {
            console.warn(`[AUTO-RETRY WORKER FAILURE] Failed to auto-send Email receipt ${order.receiptNumber}: ${emailRes.error}`);
          }

          // Also update legacy receipt status if present
          const legacyReceipt = db.receipts?.find(r => r.id === log.receiptId);
          if (legacyReceipt) {
            legacyReceipt.emailSentStatus = emailRes.success ? "sent" : "failed";
            legacyReceipt.emailSentTimestamp = log.emailSentAt || undefined;
          }

          updatedAny = true;
        } catch (emailErr: any) {
          console.error(`[AUTO-RETRY WORKER] Failed to generate PDF or send email for receipt ${log.receiptId}:`, emailErr);
          log.emailStatus = "failed";
          log.resendCount += 1;
          updatedAny = true;
        }
      }
    }

    if (updatedAny) {
      await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    }
  } catch (err) {
    console.error(`[AUTO-RETRY WORKER ERROR] Unexpected error in retry background job:`, err);
  }
}

/**
 * Resends the PDF receipt to the customer's email.
 */
export async function resendEmailReceiptAction(receiptNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    if (!db.orders) db.orders = [];
    if (!db.receiptLogs) db.receiptLogs = [];

    const order = db.orders.find(o => o.receiptNumber === receiptNumber);
    if (!order) {
      return { success: false, error: "Receipt not found." };
    }

    if (!order.customerEmail) {
      return { success: false, error: "No email address found for this receipt. Cannot send email." };
    }

    // Generate in-memory PDF buffer dynamically on request
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generateReceiptPdfBuffer(order);
    } catch (pdfErr: any) {
      console.error("[PDF GENERATION ERROR] Failed to generate e-receipt PDF during email resend:", pdfErr);
      return { success: false, error: `Failed to generate PDF receipt: ${pdfErr.message || pdfErr}` };
    }

    // Call sendReceiptEmail
    const emailRes = await sendReceiptEmail(order, pdfBuffer, order.customerEmail);

    // Update log
    let log = db.receiptLogs.find(l => l.receiptId === receiptNumber);
    if (!log) {
      log = {
        receiptId: receiptNumber,
        orderId: order.orderId,
        emailStatus: "pending",
        emailSentAt: null,
        resendCount: 0,
      };
      db.receiptLogs.push(log);
    }

    log.emailStatus = emailRes.success ? "sent" : "failed";
    log.resendCount += 1;
    if (emailRes.success) {
      log.emailSentAt = new Date().toISOString();
    }

    // Also update legacy receipt status if present
    const legacyReceipt = db.receipts?.find(r => r.id === receiptNumber);
    if (legacyReceipt) {
      legacyReceipt.emailSentStatus = emailRes.success ? "sent" : "failed";
      legacyReceipt.emailSentTimestamp = log.emailSentAt || undefined;
    }

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    if (!emailRes.success) {
      return { success: false, error: emailRes.error || "Failed to deliver email." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error resending email receipt:", err);
    return { success: false, error: err.message || "Server error occurred while resending email." };
  }
}

/**
 * Resends the receipt to the customer's WhatsApp.
 */
export async function resendWhatsAppReceiptAction(receiptNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    if (!db.orders) db.orders = [];

    const order = db.orders.find(o => o.receiptNumber === receiptNumber);
    if (!order) {
      return { success: false, error: "Receipt not found." };
    }

    if (!order.customerPhone) {
      return { success: false, error: "No phone number found for this receipt. Cannot send WhatsApp." };
    }

    // Call sendWhatsAppReceipt utility
    const waRes = await sendWhatsAppReceipt(order, order.customerPhone);

    // Update log in legacy receipts
    const legacyReceipt = db.receipts?.find(r => r.id === receiptNumber);
    if (legacyReceipt) {
      legacyReceipt.whatsAppSentStatus = waRes.success ? "sent" : "failed";
      legacyReceipt.whatsAppSentTimestamp = new Date().toISOString();
      if (!legacyReceipt.whatsAppDeliveryLogs) {
        legacyReceipt.whatsAppDeliveryLogs = [];
      }
      legacyReceipt.whatsAppDeliveryLogs.push({
        timestamp: new Date().toISOString(),
        status: waRes.success ? "success" : "failure",
        error: waRes.error,
        messageId: waRes.messageId
      });
      legacyReceipt.whatsAppMessageId = waRes.messageId;
    }

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    if (!waRes.success) {
      return { success: false, error: waRes.error || "Failed to deliver WhatsApp message." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error resending WhatsApp receipt:", err);
    return { success: false, error: err.message || "Server error occurred while resending WhatsApp receipt." };
  }
}

export async function generateUniqueReceiptNumber(serviceType: "Nursery" | "Cafeteria"): Promise<string> {
  const db = await getDb();
  const today = new Date();
  
  // Format current date as YYYYMMDD in Indian timezone
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(today);
  const year = parts.find(p => p.type === "year")?.value || "2026";
  const month = parts.find(p => p.type === "month")?.value || "06";
  const day = parts.find(p => p.type === "day")?.value || "15";
  const dateStr = `${year}${month}${day}`;

  const prefix = serviceType === "Nursery" ? "KOH-NUR" : "KOH-CAF";
  const searchPattern = `${prefix}-${dateStr}-`;

  // Find the highest sequence number for this date
  const matches = (db.orders || [])
    .filter(o => o.receiptNumber.startsWith(searchPattern))
    .map(o => {
      const parts = o.receiptNumber.split("-");
      const seqStr = parts[parts.length - 1];
      return parseInt(seqStr) || 0;
    });

  const nextSeq = matches.length > 0 ? Math.max(...matches) + 1 : 1;
  const seqStr = String(nextSeq).padStart(5, "0");

  return `${searchPattern}${seqStr}`;
}

export async function verifyRazorpayPaymentAction({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  checkoutData,
}: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  checkoutData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: "Nursery" | "Cafeteria";
    items: { itemId: string; name: string; price: number; quantity: number }[];
    amount: number;
    paymentMethod?: string;
  };
}): Promise<{ success: boolean; receiptNumber?: string; error?: string }> {
  try {
    // 1. Signature Verification
    const isMock = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.startsWith("your_");
    let verified = false;

    if (isMock) {
      console.log("[PAYMENT GATEWAY] Mock signature verification active.");
      verified = razorpay_payment_id.startsWith("pay_") && razorpay_order_id.startsWith("order_");
    } else {
      // Real signature verification
      const crypto = await import("crypto");
      const secret = process.env.RAZORPAY_KEY_SECRET!;
      const generated_signature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      
      verified = generated_signature === razorpay_signature;
    }

    if (!verified) {
      return { success: false, error: "Payment verification failed. Invalid signature." };
    }

    // 2. Load Database
    const db = await getDb();

    // 3. Inventory Stock Validation & Decrement
    if (checkoutData.serviceType === "Nursery") {
      if (!db.nursery) return { success: false, error: "Nursery service unavailable." };
      for (const item of checkoutData.items) {
        const plant = db.nursery.plants.find(p => p.id === item.itemId);
        if (!plant) return { success: false, error: `Plant ${item.name} not found.` };
        if (plant.quantity < item.quantity) {
          return { success: false, error: `Insufficient stock for ${item.name}.` };
        }
      }
      // Decrement stock
      for (const item of checkoutData.items) {
        const plant = db.nursery.plants.find(p => p.id === item.itemId)!;
        plant.quantity -= item.quantity;
      }
    } else {
      if (!db.cafeteria) return { success: false, error: "Cafeteria service unavailable." };
      for (const item of checkoutData.items) {
        const menuItem = db.cafeteria.menu.find(m => m.id === item.itemId);
        if (!menuItem) return { success: false, error: `Menu item ${item.name} not found.` };
        if (menuItem.quantity < item.quantity) {
          return { success: false, error: `Insufficient stock for ${item.name}.` };
        }
      }
      // Decrement stock
      for (const item of checkoutData.items) {
        const menuItem = db.cafeteria.menu.find(m => m.id === item.itemId)!;
        menuItem.quantity -= item.quantity;
      }
    }

    // 4. Prevent duplicate transactions
    if (!db.orders) db.orders = [];
    const duplicate = db.orders.find(o => o.transactionId === razorpay_payment_id);
    if (duplicate) {
      return { success: true, receiptNumber: duplicate.receiptNumber };
    }

    // 5. Generate unique receipt number
    const receiptNumber = await generateUniqueReceiptNumber(checkoutData.serviceType);

    // 6. Save order details
    const newOrder: Order = {
      orderId: razorpay_order_id,
      customerName: checkoutData.customerName,
      customerEmail: checkoutData.customerEmail,
      customerPhone: checkoutData.customerPhone,
      serviceType: checkoutData.serviceType,
      items: checkoutData.items,
      amount: checkoutData.amount,
      transactionId: razorpay_payment_id,
      paymentStatus: "completed",
      receiptNumber: receiptNumber,
      createdAt: new Date().toISOString(),
      orderStatus: "placed",
    };
    db.orders.push(newOrder);

    // Create initial receipt log
    if (!db.receiptLogs) db.receiptLogs = [];
    const newLog: ReceiptLog = {
      receiptId: receiptNumber,
      orderId: razorpay_order_id,
      emailStatus: "pending",
      emailSentAt: null,
      resendCount: 0,
    };
    db.receiptLogs.push(newLog);

    // Also populate legacy receipts array to keep the original /receipts/[id] page working if accessed
    if (!db.receipts) db.receipts = [];
    const legacyReceipt: Receipt = {
      id: receiptNumber,
      orderId: razorpay_order_id,
      serviceType: checkoutData.serviceType,
      date: newOrder.createdAt,
      customerName: checkoutData.customerName,
      customerPhone: checkoutData.customerPhone,
      customerEmail: checkoutData.customerEmail,
      items: checkoutData.items,
      totalAmountPaid: checkoutData.amount,
      paymentStatus: "completed",
      paymentMethod: checkoutData.paymentMethod || "Card / Online",
      whatsAppSentStatus: "pending",
      whatsAppDeliveryLogs: []
    };
    db.receipts.push(legacyReceipt);

    // Write database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // 7. Dynamic PDF & Email Delivery
    try {
      const pdfBuffer = await generateReceiptPdfBuffer(newOrder);
      const emailRes = await sendReceiptEmail(newOrder, pdfBuffer, checkoutData.customerEmail);

      // Re-read db to update email log safely
      const latestDb = await getDb();
      const logToUpdate = latestDb.receiptLogs?.find(l => l.receiptId === receiptNumber);
      if (logToUpdate) {
        logToUpdate.emailStatus = emailRes.success ? "sent" : "failed";
        if (emailRes.success) {
          logToUpdate.emailSentAt = new Date().toISOString();
        }
        
        // Also update legacy receipt status
        const legacyToUpdate = latestDb.receipts?.find(r => r.id === receiptNumber);
        if (legacyToUpdate) {
          legacyToUpdate.emailSentStatus = emailRes.success ? "sent" : "failed";
          legacyToUpdate.emailSentTimestamp = logToUpdate.emailSentAt || undefined;
        }

        await fs.writeFile(DB_PATH, JSON.stringify(latestDb, null, 2), "utf-8");
      }
    } catch (deliveryErr) {
      console.error("[DELIVERY ERROR] Failed to send receipt email after payment success:", deliveryErr);
    }

    // 7.5. Dynamic WhatsApp Delivery
    try {
      const waRes = await sendWhatsAppReceipt(newOrder, checkoutData.customerPhone);
      const latestDb = await getDb();
      const legacyToUpdate = latestDb.receipts?.find(r => r.id === receiptNumber);
      if (legacyToUpdate) {
        legacyToUpdate.whatsAppSentStatus = waRes.success ? "sent" : "failed";
        legacyToUpdate.whatsAppSentTimestamp = new Date().toISOString();
        if (!legacyToUpdate.whatsAppDeliveryLogs) {
          legacyToUpdate.whatsAppDeliveryLogs = [];
        }
        legacyToUpdate.whatsAppDeliveryLogs.push({
          timestamp: new Date().toISOString(),
          status: waRes.success ? "success" : "failure",
          error: waRes.error,
          messageId: waRes.messageId
        });
        legacyToUpdate.whatsAppMessageId = waRes.messageId;
        await fs.writeFile(DB_PATH, JSON.stringify(latestDb, null, 2), "utf-8");
      }
    } catch (waErr) {
      console.error("[DELIVERY ERROR] Failed to send receipt WhatsApp after payment success:", waErr);
    }

    // 7.6. WhatsApp Notification to Seller (if Nursery order)
    if (checkoutData.serviceType === "Nursery") {
      try {
        const latestDb = await getDb();
        const sellerPhone = latestDb.nursery?.contact || "+91 9372025677";
        
        // Build items list text
        const itemsText = newOrder.items
          .map((item) => `• ${item.name} x ${item.quantity} (₹${item.price * item.quantity})`)
          .join("\n");

        const sellerMessage = `*Kohinoor Nursery - New Order Received* 🌿

Dear Seller,

A new plant order has been placed and paid successfully.

*Order Details:*
• *Receipt Number:* ${receiptNumber}
• *Order ID:* ${razorpay_order_id}
• *Payment ID:* ${razorpay_payment_id}
• *Total Amount Paid:* ₹${checkoutData.amount}

*Items:*
${itemsText}

*Buyer Details:*
• *Name:* ${checkoutData.customerName}
• *Phone:* ${checkoutData.customerPhone}
• *Email:* ${checkoutData.customerEmail || "N/A"}

Please prepare the order for pickup. The customer will bring their receipt.

---
_Kohinoor Facilities Automation_`;

        await sendWhatsAppMessage(sellerPhone, sellerMessage);
      } catch (sellerWaErr) {
        console.error("[DELIVERY ERROR] Failed to send WhatsApp notification to seller after payment success:", sellerWaErr);
      }
    }

    // 8. Place ownership cookie inside the browser
    const cookieStore = await cookies();
    cookieStore.set({
      name: `receipt_token_${receiptNumber}`,
      value: `authorized_access_${razorpay_payment_id}`,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "strict",
    });

    return { success: true, receiptNumber };
  } catch (err: any) {
    console.error("[PAYMENT VERIFICATION ERROR] Failed:", err);
    return { success: false, error: err.message || "An unexpected error occurred during verification." };
  }
}

export async function getCustomerReceiptsAction(emailOrPhone: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
  try {
    const db = await getDb();
    if (!db.orders) db.orders = [];

    const normalized = emailOrPhone.trim().toLowerCase();
    const cleanPhone = normalized.replace(/[^0-9]/g, "");

    const customerOrders = db.orders.filter(o => {
      const emailMatches = o.customerEmail.toLowerCase() === normalized;
      const phoneMatches = o.customerPhone.replace(/[^0-9]/g, "").includes(cleanPhone) || cleanPhone.includes(o.customerPhone.replace(/[^0-9]/g, ""));
      return emailMatches || (cleanPhone.length >= 10 && phoneMatches);
    });

    return { success: true, orders: customerOrders };
  } catch (err: any) {
    console.error("Error retrieving customer receipts:", err);
    return { success: false, error: "Failed to query receipts history." };
  }
}

export async function verifyReceiptOwnershipAction(receiptNumber: string, emailOrPhone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    const order = db.orders?.find(o => o.receiptNumber === receiptNumber);
    if (!order) {
      return { success: false, error: "Receipt not found." };
    }

    const input = emailOrPhone.trim().toLowerCase();
    const cleanInputPhone = input.replace(/[^0-9]/g, "");
    const orderPhone = order.customerPhone.replace(/[^0-9]/g, "");

    const emailMatches = order.customerEmail.toLowerCase() === input;
    const phoneMatches = orderPhone.includes(cleanInputPhone) || cleanInputPhone.includes(orderPhone);

    if (emailMatches || (cleanInputPhone.length >= 6 && phoneMatches)) {
      // Grant access cookie directly
      const cookieStore = await cookies();
      cookieStore.set({
        name: `receipt_token_${receiptNumber}`,
        value: `authorized_access_${order.transactionId}`,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      return { success: true };
    }

    return { success: false, error: "Verification details do not match this receipt." };
  } catch (err: any) {
    console.error("Verification error:", err);
    return { success: false, error: "Verification server error." };
  }
}

// Fetch current order status (Swiggy/Zomato style)
export async function getOrderStatusAction(receiptNumber: string): Promise<{ success: boolean; status?: "placed" | "preparing" | "ready" | "completed"; error?: string }> {
  try {
    const db = await getDb();
    const order = db.orders?.find(o => o.receiptNumber === receiptNumber);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    return { success: true, status: order.orderStatus || "placed" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch order status" };
  }
}

// Update order status (Swiggy/Zomato style) and log notifications to managers and customer
export async function updateOrderStatusAction(
  receiptNumber: string,
  status: "placed" | "preparing" | "ready" | "completed"
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    
    // 1. Update in db.orders
    const order = db.orders?.find(o => o.receiptNumber === receiptNumber);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    order.orderStatus = status;

    // 2. Sync with legacy arrays
    if (order.serviceType === "Nursery" && db.nursery?.orders) {
      const nurseryOrder = db.nursery.orders.find(o => o.receiptId === receiptNumber || o.id === order.orderId);
      if (nurseryOrder) {
        nurseryOrder.status = status === "completed" ? "completed" : "pending";
      }
    } else if (order.serviceType === "Cafeteria" && db.cafeteria?.orders) {
      const cafeOrder = db.cafeteria.orders.find(o => o.receiptId === receiptNumber || o.id === order.orderId);
      if (cafeOrder) {
        cafeOrder.status = status === "completed" ? "completed" : "pending";
      }
    }

    // 3. Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Simulate sending status update message to managers and customer
    console.log(`\n========================================`);
    console.log(`[STATUS UPDATE NOTIFICATION] Order #${order.orderId} status changed to: ${status.toUpperCase()}`);
    console.log(`To Customer: ${order.customerName} <${order.customerEmail}>`);
    console.log(`To Property Manager: Devendra Sali <devendra.sali@kohinoorcommercial2.in>`);
    console.log(`To Security Manager: Roshan Patil <roshan.patil@kohinoorcommercial2.in>`);
    console.log(`Subject: Kohinoor Facility Hub - Order status: ${status.toUpperCase()}`);
    console.log(`Body:\nDear Customer and Managers,\n\nYour order #${order.orderId} for ${order.serviceType} is now ${status.toUpperCase()}.\n\nThank you for using Kohinoor Services Hub.`);
    console.log(`========================================\n`);

    return { success: true };
  } catch (err: any) {
    console.error("Error updating order status:", err);
    return { success: false, error: err.message || "Failed to update order status" };
  }
}

