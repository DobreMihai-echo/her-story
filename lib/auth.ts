import { cookies } from "next/headers";

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin")?.value === "1";
}
