import AppShellClient from "@/components/AppShellClient";

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShellClient>{children}</AppShellClient>;
}
