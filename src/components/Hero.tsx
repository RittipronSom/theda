import Image from "next/image";
import Link from "next/link";
import HeroWaterEffects from "./HeroWaterEffects";

export default function Hero() {
  return (
    <section className="home-hero" aria-label="ผลิตภัณฑ์ดูแลผิว THEDA">
      <div className="home-hero-photo">
        <Image
          src="/images/hero-banner-v2-right.jpg"
          alt="น้ำตบดอกไม้ THEDA และ Glow Serum ท่ามกลางดอกไม้และผิวน้ำ"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
        <HeroWaterEffects />
      </div>
      <div className="home-hero-content site-container">
        <div className="home-hero-copy">
          <h1>เติมความชุ่มชื้น<br />เปิดโหมดผิวโกลว์</h1>
          <p>น้ำตบดอกไม้ มอยส์บูสเตอร์ และครีมผิวกระจก<br />พร้อม Glow Serum สำหรับผิวดูกระจ่างใส</p>
          <Link href="/#products" className="home-hero-button">
            ดูผลิตภัณฑ์ทั้งหมด <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
