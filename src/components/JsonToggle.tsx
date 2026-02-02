"use client";

import { useState } from "react";

export default function JsonToggle({
  data,
  title = "Raw JSON",
}: {
  data: any;
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: 12,
          textDecoration: "underline",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--muted)",
        }}
      >
        {open ? `Hide ${title}` : `Show ${title}`}
      </button>
      {open && (
        <pre
          className="pre mono"
          style={{ marginTop: 6, maxHeight: 300, overflow: "auto" }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
