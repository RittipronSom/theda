import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "THEDA",
  description:
    "สกินแคร์พรีเมียมที่ผสานวิทยาศาสตร์ขั้นสูงและสารสกัดจากธรรมชาติ เพื่อคืนความเปล่งประกายให้ผิวคุณ ผลิตภัณฑ์ดูแลผิวหน้าคุณภาพสูงจาก THEDA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body
        className={`${kanit.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
