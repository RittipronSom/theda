import { db } from "@db/client";
import { settings } from "@db/schema";

export function getSetting(key: string, fallback = ""): string {
  const row = db.select().from(settings).where(eqKey(key)).all()[0];
  return row?.value ?? fallback;
}

import { eq } from "drizzle-orm";
function eqKey(key: string) {
  return eq(settings.key, key);
}

export function getShopConfig() {
  return {
    shippingFee: Number(getSetting("shipping_fee", "50")),
    freeShippingMin: Number(getSetting("free_shipping_min", "500")),
    promptpayId: getSetting("promptpay_id", ""),
    bankAccounts: JSON.parse(getSetting("bank_accounts", "[]")) as {
      bank: string;
      name: string;
      no: string;
    }[],
  };
}

export function setSetting(key: string, value: string) {
  db.insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } })
    .run();
}
