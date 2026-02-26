import Sidebar from "@/components/Sidebar";

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="appShell">
      <Sidebar />
      <div className="appMain">{children}</div>
    </div>
  );
}
