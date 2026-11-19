import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา | THEDA",
  description: "สอบถามสินค้าและการสั่งซื้อ พร้อมติดตามข่าวสาร THEDA ผ่าน Facebook, Instagram, TikTok และ LINE",
};

const channels = [
  { name: "Facebook", note: "ติดตามข่าวสารและกิจกรรม", href: "https://www.facebook.com/people/THEDA/61569801624705/", style: "facebook", icon: "facebook" },
  { name: "LINE", note: "สอบถามสินค้าและการสั่งซื้อ", href: "https://lin.ee/6bB6rOG", style: "line", icon: "line" },
  { name: "Instagram", note: "อัปเดตเคล็ดลับและแรงบันดาลใจ", href: "https://www.instagram.com/thedaskincare_official/", style: "instagram", icon: "instagram" },
  { name: "TikTok", note: "ดูคอนเทนต์และไลฟ์สด", href: "https://www.tiktok.com/@theda.skincareofficial?_r=1&_t=ZS-97igP2AWS4A", style: "tiktok", icon: "tiktok" },
];

function SocialIcon({ kind }: { kind: string }) {
  if (kind === "facebook") return <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M28 43V26h6l1-7h-7v-4c0-2 1-3 4-3h4V6c-2-.3-4-.5-6-.5-6 0-10 4-10 10V19h-6v7h6v17z" /></svg>;
  if (kind === "instagram") return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><rect x="10" y="10" width="28" height="28" rx="8" /><circle cx="24" cy="24" r="7" /><circle cx="33" cy="15" r="1.7" fill="currentColor" stroke="none" /></svg>;
  if (kind === "line") return <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M40 22c0-9-7-15-16-15S8 13 8 22c0 8 6 13 14 14l-1 6c7-3 19-11 19-20z" /><text x="24" y="25" textAnchor="middle" fill="#06b842" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="9">LINE</text></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28 9v22a7 7 0 1 1-6-7" fill="none" stroke="#25f4ee" strokeWidth="5" transform="translate(-1 1)" /><path d="M29 9c0 7 4 10 10 10M29 9v22a7 7 0 1 1-6-7" fill="none" stroke="#fe2c55" strokeWidth="5" transform="translate(1 0)" /><path d="M28 8c0 7 4 10 10 10M28 8v22a7 7 0 1 1-6-7" fill="none" stroke="white" strokeWidth="4" /></svg>;
}

export default function ContactPage() {
  return (
    <section className="contact-page">
      <div className="contact-waves" aria-hidden="true"><span /><span /></div>
      <div className="site-container contact-content">
        <div className="contact-intro">
          <p className="label-caps text-gold">THEDA · CONTACT US</p>
          <h1>ติดต่อ<span>เรา</span></h1>
          <p className="contact-description">มีคำถามเกี่ยวกับสินค้า การสั่งซื้อ<br className="hidden sm:block" /> หรือแจ้งปัญหา ติดต่อเราได้ที่นี่</p>
          <a className="contact-line-cta" href="https://lin.ee/6bB6rOG" target="_blank" rel="noopener noreferrer">พูดคุยกับเราผ่าน LINE <span aria-hidden="true">↗</span></a>
          <p className="contact-direct-note">เลือกช่องทางที่สะดวก แล้วส่งข้อความถึงเราได้เลย</p>
        </div>
        <div className="contact-socials">
          <h2>ให้การดูแลผิว<br />เป็นเรื่อง<span>ง่ายขึ้น</span></h2>
          <p>ติดตามข่าวสาร โปรโมชั่น และกิจกรรมต่าง ๆ ของ THEDA<br className="hidden sm:block" /> ได้ทางช่องทางด้านล่างนี้</p>
          <div className="contact-channel-grid">
            {channels.map(channel => (
              <a key={channel.name} className={`contact-channel contact-${channel.style}`} href={channel.href} target="_blank" rel="noopener noreferrer" aria-label={`${channel.name} — ${channel.note} (เปิดแท็บใหม่)`}>
                <span className="contact-social-icon"><SocialIcon kind={channel.icon} /></span>
                <span className="min-w-0"><strong>{channel.name}</strong><small>{channel.note}</small></span>
                <span className="contact-channel-arrow" aria-hidden="true">›</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
