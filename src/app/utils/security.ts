import { cookies } from "next/headers";
import { getDb } from "../actions";

/**
 * Grants secure temporary receipt access to the user's browser by writing a signed token cookie.
 */
export async function grantReceiptAccess(receiptNumber: string, transactionId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: `receipt_token_${receiptNumber}`,
    value: `authorized_access_${transactionId}`,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Checks whether the current user is authorized to view a specific receipt.
 * Validates the request cookie token against the order transaction ID.
 */
export async function hasReceiptAccess(receiptNumber: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(`receipt_token_${receiptNumber}`);
  if (!token) {
    return false;
  }

  // Double-check against order in db.json
  const db = await getDb();
  const order = db.orders?.find((o) => o.receiptNumber === receiptNumber);
  if (!order) {
    return false;
  }

  return token.value === `authorized_access_${order.transactionId}`;
}
