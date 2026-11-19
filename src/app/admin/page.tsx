import Link from "next/link";
import { listOrders } from "@/lib/orders";
import { db } from "@db/client";
import { products } from "@db/schema";
import { asc } from "drizzle-orm";
import { StatusSelect } from "@/components/admin/AdminControls";

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");

export default async function AdminDashboard() {
  const orders = listOrders(100);
  const allProducts = db.select().from(products).orderBy(asc(products.sortOrder)).all();

  const today = new Date().setHours(0, 0, 0, 0);
  const revenueAll = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const revenueToday = orders
    .filter((o) => o.createdAt >= today && o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const waiting = orders.filter((o) => o.status === "waiting_payment").length;
  const toShip = orders.filter((o) => o.status === "paid").length;
  const lowStock = allProducts.filter((p) => p.stock <= 10);
  const recent = orders.slice(0, 8);

  return (
    <>
      <h1 className="font-display text-3xl">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { n: thb(revenueToday), t: "ยอดขายวันนี้" },
          { n: thb(revenueAll), t: "ยอดขายรวม" },
          { n: String(waiting), t: "รอชำระเงิน" },
          { n: String(toShip), t: "รอจัดส่ง" },
        ].map((s) => (
          <div key={s.t} className="card-frame rounded-2xl p-6">
            <p className="font-display text-3xl">{s.n}</p>
            <p className="mt-1.5 text-xs tracking-wide text-taupe">{s.t}</p>
          </div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <p className="mt-6 rounded-xl bg-gold/20 px-5 py-3 text-xs text-espresso">
          สต็อกต่ำ: {lowStock.map((p) => `${p.name} (เหลือ ${p.stock})`).join(" · ")} —{" "}
          <Link href="/admin/products" className="underline">
            ไปเติมสต็อก
          </Link>
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-2xl">ออเดอร์ล่าสุด</h2>
        <Link href="/admin/orders" className="text-xs tracking-widest text-gold hover:underline">
          ดูทั้งหมด →
        </Link>
      </div>
      <div className="card-frame mt-4 overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-espresso/10 text-left text-[0.68rem] uppercase tracking-widest text-taupe">
              <th className="px-5 py-3.5">ออเดอร์</th>
              <th className="px-5 py-3.5">ลูกค้า</th>
              <th className="px-5 py-3.5">ยอด</th>
              <th className="px-5 py-3.5">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-taupe">
                  ยังไม่มีออเดอร์
                </td>
              </tr>
            )}
            {recent.map((o) => (
              <tr key={o.id} className="border-b border-espresso/5 last:border-0">
                <td className="px-5 py-3 font-display">{o.orderNo}</td>
                <td className="px-5 py-3">{o.customerName}</td>
                <td className="px-5 py-3">{thb(o.total)}</td>
                <td className="px-5 py-3">
                  <StatusSelect orderNo={o.orderNo} status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
