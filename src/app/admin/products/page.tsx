import { db } from "@db/client";
import { products } from "@db/schema";
import { asc } from "drizzle-orm";
import { EditableCell, DeleteProductButton } from "@/components/admin/AdminControls";

const thb = (n: number) => "฿" + n.toLocaleString("th-TH");

export default async function AdminProductsPage() {
  const all = db.select().from(products).orderBy(asc(products.sortOrder)).all();
  return (
    <>
      <h1 className="font-display text-3xl">สินค้า & สต็อก</h1>
      <p className="mt-2 text-xs tracking-wide text-taupe">
        แก้ราคา/สต็อกได้เลยในตาราง — บันทึกอัตโนมัติเมื่อคลิกออกจากช่อง
      </p>

      <div className="card-frame mt-6 overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-espresso/10 text-left text-[0.68rem] uppercase tracking-widest text-taupe">
              <th className="px-5 py-3.5">สินค้า</th>
              <th className="px-5 py-3.5">ขนาด</th>
              <th className="px-5 py-3.5">ราคา</th>
              <th className="px-5 py-3.5">สต็อก</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {all.map((p) => (
              <tr key={p.slug} className="border-b border-espresso/5 last:border-0">
                <td className="px-5 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-taupe">
                    {p.badge ?? "—"} · ปัจจุบัน {thb(p.price)} · คงเหลือ {p.stock} ชิ้น
                  </p>
                </td>
                <td className="px-5 py-3 text-taupe">{p.size}</td>
                <td className="px-5 py-3">
                  <EditableCell slug={p.slug} field="price" value={p.price} suffix="฿" />
                </td>
                <td className="px-5 py-3">
                  <EditableCell slug={p.slug} field="stock" value={p.stock} suffix="ชิ้น" />
                </td>
                <td className="px-5 py-3 text-right">
                  <DeleteProductButton slug={p.slug} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
