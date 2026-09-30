"use client";

import { useState } from "react";

function parseReferrer(referrer: string) {
  try {
    const url = new URL(referrer);
    return {
      host: url.host,
      path: url.pathname !== "/" ? url.pathname : null,
      params: [...url.searchParams.entries()],
    };
  } catch {
    return null;
  }
}

export default function ReferrerToggle({ referrer }: { referrer: string | null }) {
  const [open, setOpen] = useState(false);

  if (!referrer) {
    return (
      <span
        style={{
          display: "block",
          padding: "var(--pad-cell-y) var(--pad-cell-x)",
          color: "var(--muted-2)",
        }}
      >
        —
      </span>
    );
  }

  const parsed = parseReferrer(referrer);

  return (
    <div style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>
      <button
        type="button"
        className="chip"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        title={referrer}
        style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}
      >
        {open ? "Hide" : parsed?.host ?? "View"}
      </button>

      {open && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          {parsed ? (
            <>
              <div>
                <span style={{ fontWeight: 600 }}>Host:</span>{" "}
                <span className="mono">{parsed.host}</span>
              </div>
              {parsed.path && (
                <div>
                  <span style={{ fontWeight: 600 }}>Path:</span>{" "}
                  <span className="mono" style={{ wordBreak: "break-all" }}>{parsed.path}</span>
                </div>
              )}
              {parsed.params.map(([key, value], i) => (
                <div key={`${key}-${i}`}>
                  <span style={{ fontWeight: 600 }}>{key}:</span>{" "}
                  <span className="mono" style={{ wordBreak: "break-all" }}>{value}</span>
                </div>
              ))}
            </>
          ) : null}
          <pre className="pre mono" style={{ marginTop: 6, maxHeight: 120, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {referrer}
          </pre>
        </div>
      )}
    </div>
  );
}
