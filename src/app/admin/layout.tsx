import { redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/account");

  return (
    <div className="min-h-screen bg-ivory">
      {/* admin topbar */}
      <header className="sticky top-0 z-40 border-b border-espresso/10 bg-espresso text-cream">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-gold px-2.5 py-0.5 text-[0.6rem] font-bold tracking-[0.2em] text-white">
              ADMIN
            </span>
            <span className="font-display text-lg tracking-[0.3em]">THEDA</span>
          </div>
          <div className="flex items-center gap-5 text-xs tracking-widest">
            <span className="hidden text-cream/60 sm:block">{user.name}</span>
            <Link href="/" className="text-cream/75 transition-colors hover:text-gold-light">
              หน้าร้าน
            </Link>
            <AdminLogout />
          </div>
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">{children}</main>
    </div>
  );
}

function AdminLogout() {
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
      <button className="text-cream/75 transition-colors hover:text-gold-light">ออกจากระบบ</button>
    </form>
  );
}
