import { redirect } from "next/navigation";
import AppShellClient from "@/components/AppShellClient";
import { getAuthRole } from "@/lib/auth";

export default async function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sessions tab is super_admin only
  const role = await getAuthRole();
  if (role !== "super_admin") redirect("/leads");

  return <AppShellClient>{children}</AppShellClient>;
}
