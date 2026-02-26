"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    label: "Leads",
    href: "/leads",
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleSignOut() {
    localStorage.removeItem("is_admin_authenticated");
    router.push("/login");
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebarBrand">
        <Image
          src="/useryze-logo.png"
          alt="Useryze"
          width={150}
          height={150}
          style={{ display: "block" }}
        />
        {/* <div className="sidebarAppName">Engagement Dashboard</div> */}
      </div>

      {/* Navigation */}
      <nav className="sidebarNav">
        <div className="sidebarSectionLabel">Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebarLink${isActive(item.href, item.exact) ? " active" : ""}`}
          >
            <span className="sidebarIcon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebarFooter">
        <button className="sidebarLink" onClick={handleSignOut}>
          <span className="sidebarIcon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
