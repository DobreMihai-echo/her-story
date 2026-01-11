import { cookies } from "next/headers";

export function isAdmin() {
  return cookies().get("admin")?.value === "1";
}
