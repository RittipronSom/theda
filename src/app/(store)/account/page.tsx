import { redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { db } from "@db/client";
import { orders, orderItems } from "@db/schema";
import { desc, eq, inArray } from "drizzle-orm";

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");
const STATUS_LABEL: Record<string, string> = {
  waiting_payment: "รอชำระเงิน",
  paid: "รอจัดส่ง",
  shipped: "จัดส่งแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const myOrders = db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt)).limit(20).all();
  const ids = myOrders.map((o) => o.id);
  const items = ids.length ? db.select().from(orderItems).where(inArray(orderItems.orderId, ids)).all() : [];

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-gold">บัญชีของฉัน</p>
          <h1 className="mt-3 font-display text-4xl">สวัสดี {user.name}</h1>
          <p className="mt-2 text-sm text-taupe">
            เบอร์ {user.phone}
            {user.email ? ` · ${user.email}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-full bg-espresso px-6 py-2.5 text-xs tracking-widest text-cream transition-colors hover:bg-gold hover:text-white"
            >
              เข้าหลังบ้านแอดมิน →
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl">ประวัติออเดอร์</h2>
      {myOrders.length === 0 ? (
        <div className="card-frame mt-5 rounded-2xl p-10 text-center">
          <p className="text-sm text-taupe">ยังไม่มีออเดอร์ — เริ่มช้อปได้เลย</p>
          <Link href="/#products" className="mt-5 inline-block rounded-full bg-espresso px-8 py-3 text-sm text-cream">
            สำรวจผลิตภัณฑ์
          </Link>
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {myOrders.map((o) => {
            const its = items.filter((i) => i.orderId === o.id);
            return (
              <li key={o.id} className="card-frame rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link href={`/orders/${o.orderNo}?phone=${o.phone}`} className="font-display text-lg hover:text-gold">
                    {o.orderNo}
                  </Link>
                  <span
                    className={`rounded-full px-3.5 py-1 text-[0.65rem] tracking-widest ${
                      o.status === "cancelled"
                        ? "bg-espresso text-cream/70"
                        : o.status === "waiting_payment"
                          ? "bg-gold/20 text-espresso"
                          : "bg-espresso text-gold-light"
                    }`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <p className="mt-2 text-xs text-taupe">
                  {new Date(o.createdAt).toLocaleString("th-TH")} · {its.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                </p>
                <p className="mt-3 text-right font-display text-xl">{thb(o.total)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        const { destroySession, SESSION_COOKIE } = await import("@/lib/auth");
        const store = await cookies();
        const token = store.get(SESSION_COOKIE)?.value;
        if (token) destroySession(token);
        store.delete(SESSION_COOKIE);
        redirect("/login");
      }}
    >
      <button className="rounded-full border border-espresso/20 px-6 py-2.5 text-xs tracking-widest text-taupe transition-colors hover:border-gold hover:text-espresso">
        ออกจากระบบ
      </button>
    </form>
  );
}
