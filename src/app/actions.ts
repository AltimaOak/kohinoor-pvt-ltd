"use server";

import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

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

export interface ReceiptLog {
  timestamp: string;
  status: "success" | "failure";
  error?: string;
}

export interface Receipt {
  id: string; // REC-XXXXXX
  orderId: string;
  serviceType: "Nursery" | "Cafeteria";
  date: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmountPaid: number;
  paymentStatus: "completed" | "pending";
  paymentMethod: string;
  whatsAppSentStatus: "sent" | "failed" | "pending";
  whatsAppSentTimestamp?: string;
  whatsAppDeliveryLogs: ReceiptLog[];
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
      receipts: []
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
    
    // Simulate sending email to doctor
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Outgoing Mail`);
    console.log(`To Doctor: ${booking.doctorName} <${doctorEmail}>`);
    console.log(`Cc Occupant: ${booking.userName} <${booking.userEmail}>`);
    console.log(`Subject: Confirmed Appointment Request - ${booking.userName}`);
    console.log(`Body:\nDear ${booking.doctorName},\n\nYou have a new medical appointment scheduled.\n\nDetails:\n- Occupant: ${booking.userName}\n- Phone: ${booking.userPhone}\n- Email: ${booking.userEmail}\n- Date: ${booking.date}\n- Time: ${booking.time}\n- Reason/Notes: ${booking.message}\n\nThis is a system-generated request dispatched via the Kohinoor Services Hub.`);
    console.log(`========================================\n`);

    return { success: true };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Failed to submit booking" };
  }
}

// Plant purchase server action
export async function buyPlantAction(order: Omit<PlantOrder, "id" | "createdAt" | "status">): Promise<{ success: boolean; orderId?: string; error?: string }> {
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
    const newReceipt: Receipt = {
      id: receiptId,
      orderId: orderId,
      serviceType: "Nursery",
      date: newOrder.createdAt,
      customerName: order.userName,
      customerPhone: order.userPhone,
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

    // Format WhatsApp message as requested
    const whatsAppMessage = `Thank you for your order with Kohinoor Facilities.\n\n` +
      `Your order has been confirmed.\n\n` +
      `Receipt No: ${receiptId}\n` +
      `Service: Nursery\n` +
      `Total Paid: ₹${order.totalPrice}\n\n` +
      `A detailed receipt is attached below:\n` +
      `http://localhost:8000/receipts/${receiptId}\n\n` +
      `Thank you for choosing Kohinoor Facilities.`;

    // Trigger Twilio dispatch
    const twilioRes = await sendTwilioWhatsApp(order.userPhone, whatsAppMessage);
    
    // Log Delivery
    const logEntry = {
      timestamp: new Date().toISOString(),
      status: twilioRes.success ? ("success" as const) : ("failure" as const),
      error: twilioRes.error
    };
    newReceipt.whatsAppDeliveryLogs.push(logEntry);
    newReceipt.whatsAppSentStatus = twilioRes.success ? "sent" : "failed";
    if (twilioRes.success) {
      newReceipt.whatsAppSentTimestamp = logEntry.timestamp;
    }

    if (!db.receipts) {
      db.receipts = [];
    }
    db.receipts.push(newReceipt);

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Simulate sending email to nursery manager & purchaser
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Nursery Order Received`);
    console.log(`To Nursery Manager: nursery@kohinoorcommercial2.in`);
    console.log(`Cc Purchaser: ${order.userName} <${order.userEmail}>`);
    console.log(`Subject: New Plant Purchase Confirmation - Order #${newOrder.id}`);
    console.log(`Body:\nDear Nursery Team,\n\nA new plant purchase order has been submitted.\n\nOrder Details:\n- Order ID: ${newOrder.id}\n- Plant Name: ${newOrder.plantName}\n- Quantity: ${newOrder.quantity}\n- Total Price: ₹${newOrder.totalPrice}\n- Purchaser: ${order.userName}\n- Contact: ${order.userPhone}\n- Email: ${order.userEmail}\n- Delivery Method: Self-Pickup\n\nPlease prepare the order for handoff.\n\nBest Regards,\nKohinoor Facility Hub`);
    console.log(`========================================\n`);

    // Keep console log simulation for visibility
    console.log(`\n========================================`);
    console.log(`[WHATSAPP DISPATCH] Outgoing WhatsApp message to ${order.userPhone}`);
    console.log(`Message:\n${whatsAppMessage}`);
    console.log(`========================================\n`);

    return { success: true, orderId, receiptId, whatsAppSentStatus: newReceipt.whatsAppSentStatus };
  } catch (error) {
    console.error("Error creating nursery purchase order:", error);
    return { success: false, error: "Failed to process plant purchase" };
  }
}

// Cafeteria purchase server action
export async function buyCafeteriaAction(order: Omit<CafeOrder, "id" | "createdAt" | "status">): Promise<{ success: boolean; orderId?: string; error?: string }> {
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
    const newReceipt: Receipt = {
      id: receiptId,
      orderId: orderId,
      serviceType: "Cafeteria",
      date: newOrder.createdAt,
      customerName: order.userName,
      customerPhone: order.userPhone,
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

    // Format WhatsApp message as requested
    const whatsAppMessage = `Thank you for your order with Kohinoor Facilities.\n\n` +
      `Your order has been confirmed.\n\n` +
      `Receipt No: ${receiptId}\n` +
      `Service: Cafeteria\n` +
      `Total Paid: ₹${order.totalPrice}\n\n` +
      `A detailed receipt is attached below:\n` +
      `http://localhost:8000/receipts/${receiptId}\n\n` +
      `Thank you for choosing Kohinoor Facilities.`;

    // Trigger Twilio dispatch
    const twilioRes = await sendTwilioWhatsApp(order.userPhone, whatsAppMessage);
    
    // Log Delivery
    const logEntry = {
      timestamp: new Date().toISOString(),
      status: twilioRes.success ? ("success" as const) : ("failure" as const),
      error: twilioRes.error
    };
    newReceipt.whatsAppDeliveryLogs.push(logEntry);
    newReceipt.whatsAppSentStatus = twilioRes.success ? "sent" : "failed";
    if (twilioRes.success) {
      newReceipt.whatsAppSentTimestamp = logEntry.timestamp;
    }

    if (!db.receipts) {
      db.receipts = [];
    }
    db.receipts.push(newReceipt);

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Simulate sending email to Cafeteria Manager & Purchaser
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Cafeteria Order Received`);
    console.log(`To Cafeteria Manager: cafeteria@kohinoorcommercial2.in`);
    console.log(`Cc Purchaser: ${order.userName} <${order.userEmail}>`);
    console.log(`Subject: New Cafeteria Order Confirmation - Order #${newOrder.id}`);
    console.log(`Body:\nDear Cafeteria Team,\n\nA new food & beverage order has been submitted.\n\nOrder Details:\n- Order ID: ${newOrder.id}\n- Purchaser: ${order.userName}\n- Contact: ${order.userPhone}\n- Email: ${order.userEmail}\n- Total Price: ₹${newOrder.totalPrice}\n\nItems Ordered:\n${order.items.map(item => `- ${item.name} x ${item.quantity} (₹${item.price * item.quantity})`).join('\n')}\n\nPlease prepare the order for self-pickup.\n\nBest Regards,\nKohinoor Facility Hub`);
    console.log(`========================================\n`);

    // Console log for server-side visibility
    console.log(`\n========================================`);
    console.log(`[WHATSAPP DISPATCH] Outgoing WhatsApp message to ${order.userPhone}`);
    console.log(`Message:\n${whatsAppMessage}`);
    console.log(`========================================\n`);

    return { success: true, orderId, receiptId, whatsAppSentStatus: newReceipt.whatsAppSentStatus };
  } catch (error) {
    console.error("Error creating cafeteria order:", error);
    return { success: false, error: "Failed to process cafeteria order" };
  }
}

// Resend WhatsApp receipt action (can be called by user or admin)
export async function resendReceiptAction(receiptId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    if (!db.receipts) {
      db.receipts = [];
    }

    const receiptIndex = db.receipts.findIndex(r => r.id === receiptId);
    if (receiptIndex === -1) {
      return { success: false, error: "Receipt not found." };
    }

    const receipt = db.receipts[receiptIndex];

    // Reconstruct WhatsApp Message
    const whatsAppMessage = `Thank you for your order with Kohinoor Facilities.\n\n` +
      `Your order has been confirmed.\n\n` +
      `Receipt No: ${receipt.id}\n` +
      `Service: ${receipt.serviceType}\n` +
      `Total Paid: ₹${receipt.totalAmountPaid}\n\n` +
      `A detailed receipt is attached below:\n` +
      `http://localhost:8000/receipts/${receipt.id}\n\n` +
      `Thank you for choosing Kohinoor Facilities.`;

    // Trigger Twilio dispatch
    const twilioRes = await sendTwilioWhatsApp(receipt.customerPhone, whatsAppMessage);

    // Log Delivery
    const logEntry = {
      timestamp: new Date().toISOString(),
      status: twilioRes.success ? ("success" as const) : ("failure" as const),
      error: twilioRes.error
    };
    
    if (!receipt.whatsAppDeliveryLogs) {
      receipt.whatsAppDeliveryLogs = [];
    }
    receipt.whatsAppDeliveryLogs.push(logEntry);
    receipt.whatsAppSentStatus = twilioRes.success ? "sent" : "failed";
    if (twilioRes.success) {
      receipt.whatsAppSentTimestamp = logEntry.timestamp;
    }

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    if (!twilioRes.success) {
      return { success: false, error: twilioRes.error || "Failed to deliver WhatsApp message." };
    }

    return { success: true };
  } catch (err) {
    console.error("Error resending receipt:", err);
    return { success: false, error: "Server error occurred while resending." };
  }
}
