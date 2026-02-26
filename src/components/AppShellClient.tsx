"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "./Sidebar";

export default function AppShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="appShell">
      {/* Overlay backdrop (mobile only) */}
      {open && (
        <div className="sidebarOverlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar mobileOpen={open} onMobileClose={() => setOpen(false)} />

      {/* Main area */}
      <div className="appMain">
        {/* Mobile top bar */}
        <div className="mobileTopBar">
          <button
            className="hamburgerBtn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Image
            src="/useryze-logo.png"
            alt="Useryze"
            width={100}
            height={100}
            style={{ display: "block" }}
          />
        </div>

        {children}
      </div>
    </div>
  );
}
