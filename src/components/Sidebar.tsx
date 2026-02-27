"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [shopName, setShopName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_user')
      if (raw) {
        const user = JSON.parse(raw)
        setShopName(user.shopName ?? null)
      }
    } catch {
      // ignore
    }
  }, [])

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleSignOut() {
    // Clear cookies
    document.cookie = 'auth_token=; path=/; max-age=0'
    document.cookie = 'auth_role=; path=/; max-age=0'
    document.cookie = 'auth_shop_name=; path=/; max-age=0'
    // Clear localStorage
    localStorage.removeItem('auth_user')
    router.push("/login");
  }

  return (
    <aside className={`sidebar${mobileOpen ? " mobileOpen" : ""}`}>
      {/* Brand */}
      <div className="sidebarBrand">
        <Image
          src="/useryze-logo.png"
          alt="Useryze"
          width={150}
          height={150}
          style={{ display: "block" }}
        />
        {/* Mobile close button */}
        <button className="sidebarCloseBtn" onClick={onMobileClose} aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebarNav">
        <div className="sidebarSectionLabel">Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebarLink${isActive(item.href, item.exact) ? " active" : ""}`}
            onClick={onMobileClose}
          >
            <span className="sidebarIcon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebarFooter">
        {shopName && (
          <div style={{ padding: '0 12px 12px', fontSize: 12, color: 'var(--muted)' }}>
            {shopName}
          </div>
        )}
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
