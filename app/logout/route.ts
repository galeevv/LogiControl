import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/session";

export async function POST() {
  await clearSessionCookie();
  redirect("/login");
}

export async function GET() {
  await clearSessionCookie();
  redirect("/login");
}
