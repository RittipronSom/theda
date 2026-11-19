import { listOrders } from "@/lib/orders";
import { OrderRow } from "@/components/admin/AdminControls";

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");

export default async function AdminOrdersPage() {
  const orders = listOrders(200);
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl">ออเดอร์ทั้งหมด</h1>
        <p className="text-xs tracking-wide text-taupe">{orders.length} รายการ</p>
      </div>

      <div className="card-frame mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-espresso/10 text-left text-[0.68rem] uppercase tracking-widest text-taupe">
              <th className="px-5 py-3.5">ออเดอร์</th>
              <th className="px-5 py-3.5">วันที่</th>
              <th className="px-5 py-3.5">ลูกค้า</th>
              <th className="px-5 py-3.5">ชำระผ่าน</th>
              <th className="px-5 py-3.5">ยอด</th>
              <th className="px-5 py-3.5">สถานะ / Tracking</th>
              <th className="px-5 py-3.5">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-taupe">
                  ยังไม่มีออเดอร์
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <OrderRow
                key={o.id}
                orderNo={o.orderNo}
                date={new Date(o.createdAt).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "2-digit",
                })}
                name={`${o.customerName} (${o.phone})`}
                pay={o.paymentMethod === "promptpay" ? "PromptPay" : "โอนธนาคาร"}
                total={thb(o.total)}
                status={o.status}
                trackingNo={o.trackingNo}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
