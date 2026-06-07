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
  phone: string;
  email: string;
  avatarColor: string;
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
}

export interface NurserySchema {
  description: string;
  location: string;
  timing: string;
  contact: string;
  plants: PlantItem[];
  orders: PlantOrder[];
}

export interface DatabaseSchema {
  events: EventItem[];
  services: ServiceItem[];
  photos: PhotoItem[];
  contacts: ContactsData;
  doctors?: DoctorItem[];
  bookings?: BookingItem[];
  nursery?: NurserySchema;
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
export async function buyPlantAction(order: Omit<PlantOrder, "id" | "createdAt" | "status">): Promise<{ success: boolean; error?: string }> {
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
    const newOrder: PlantOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (!db.nursery.orders) {
      db.nursery.orders = [];
    }
    db.nursery.orders.push(newOrder);

    // Save database
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");

    // Simulate sending email to nursery manager & purchaser
    console.log(`\n========================================`);
    console.log(`[EMAIL DISPATCH] Nursery Order Received`);
    console.log(`To Nursery Manager: nursery@kohinoorcommercial2.in`);
    console.log(`Cc Purchaser: ${order.userName} <${order.userEmail}>`);
    console.log(`Subject: New Plant Purchase Confirmation - Order #${newOrder.id}`);
    console.log(`Body:\nDear Nursery Team,\n\nA new plant purchase order has been submitted.\n\nOrder Details:\n- Order ID: ${newOrder.id}\n- Plant Name: ${newOrder.plantName}\n- Quantity: ${newOrder.quantity}\n- Total Price: ₹${newOrder.totalPrice}\n- Purchaser: ${order.userName}\n- Contact: ${order.userPhone}\n- Email: ${order.userEmail}\n- Delivery Method: ${order.deliveryMethod === "pickup" ? "Self-Pickup" : `Deliver to Office (${order.officeUnit || 'N/A'})`}\n\nPlease prepare the order for handoff.\n\nBest Regards,\nKohinoor Facility Hub`);
    console.log(`========================================\n`);

    return { success: true };
  } catch (error) {
    console.error("Error creating nursery purchase order:", error);
    return { success: false, error: "Failed to process plant purchase" };
  }
}
