import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  // ถ้าล็อกอินอยู่แล้ว → ไปหน้าที่ควรอยู่ ไม่ต้องกรอกใหม่
  const user = await currentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/account");
  return <LoginForm />;
}
