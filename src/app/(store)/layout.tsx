import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Store pages read the live database (products, stock, settings) on every request.
export const dynamic = "force-dynamic";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
