import { fetchSessions, fetchSessionStats } from "@/lib/sessions";
import { getAuthHeaders, getAuthRole } from "@/lib/auth";
import Link from "next/link";
import ShopFilter from "@/components/ShopFilter";
import ReferrerToggle from "@/components/ReferrerToggle";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-US", {
        timeZone: "America/Chicago",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function fmtRate(converted: number, total: number) {
  if (!total) return "—";
  return `${((converted / total) * 100).toFixed(1)}%`;
}

function utmSourceFromReferrer(referrer: string | null) {
  if (!referrer) return "";
  try {
    return new URL(referrer).searchParams.get("utm_source") ?? "";
  } catch {
    return "";
  }
}

function CellLink({
  href,
  children,
  mono,
}: {
  href: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`cellLink${mono ? " mono" : ""}`}
      title={typeof children === "string" ? children : undefined}
    >
      {children || <span style={{ color: "var(--muted-2)" }}>—</span>}
    </Link>
  );
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ shop?: string }>;
}) {
  const sp = await searchParams;
  const selectedShop = sp?.shop ?? "";

  const [authHeaders, role] = await Promise.all([getAuthHeaders(), getAuthRole()]);
  const isSuperAdmin = role === "super_admin";

  const [data, stats] = await Promise.all([
    fetchSessions({ limit: 50, offset: 0 }, authHeaders),
    fetchSessionStats(authHeaders),
  ]);

  // Unique shops from all fetched sessions (for the dropdown — super_admin only)
  const allShops = isSuperAdmin
    ? [...new Set(data.sessions.map((s) => s.shop_name).filter(Boolean) as string[])].sort()
    : [];

  // Apply shop filter (super_admin client-side; others are scoped server-side)
  const sessions = isSuperAdmin && selectedShop
    ? data.sessions.filter((s) => s.shop_name === selectedShop)
    : data.sessions;

  // Stats endpoint is global; fall back to the current view when a shop is selected
  const totalSessions = selectedShop ? sessions.length : stats.total_sessions;
  const convertedSessions = selectedShop
    ? sessions.filter((s) => !!s.lead_id).length
    : stats.converted_sessions;

  const isFiltered = selectedShop.length > 0;

  return (
    <main className="app">
      <div className="container">
        {/* ── Page header ── */}
        <header className="topbar">
          <div>
            <h1 className="title">Sessions</h1>
            <p className="subtitle">
              {data.total} sessions in database · newest first
            </p>
          </div>

          {isFiltered && (
            <Link href="/sessions" className="btn">
              ✕ Clear filters
            </Link>
          )}
        </header>

        {/* ── Stats ── */}
        <div className="statsRow">
          <div className="statCard">
            <div className="statLabel">Total Sessions</div>
            <div className="statValue">{totalSessions}</div>
            <div className="statMeta">{selectedShop ? "in selected shop" : "all time"}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Converted</div>
            <div className="statValue">{convertedSessions}</div>
            <div className="statMeta">became a lead</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Conversion Rate</div>
            <div className="statValue">{fmtRate(convertedSessions, totalSessions)}</div>
            <div className="statMeta">converted / total</div>
          </div>
        </div>

        {/* ── Filters ── */}
        {isSuperAdmin && (
          <div className="searchRow">
            <ShopFilter
              shops={allShops}
              currentShop={selectedShop}
              currentQ=""
              basePath="/sessions"
            />
          </div>
        )}

        {/* ── Table ── */}
        <section className="card">
          <div className="cardHeader">
            <span className="cardTitle">
              {selectedShop ? selectedShop : "All Sessions"}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {sessions.length} of {data.total}
            </span>
          </div>

          <div className="tableWrap">
            <table className="table">
              <colgroup>
                <col style={{ width: 170 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 170 }} />
                <col />
              </colgroup>

              <thead>
                <tr>
                  {[
                    "Started",
                    "Shop",
                    "Device",
                    "Referrer",
                    "UTM Source",
                    "Entry Model ID",
                    "Events",
                    "Status",
                    "Last Seen",
                    "Journey",
                  ].map((h) => (
                    <th key={h} className="th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "var(--muted)",
                        fontSize: 14,
                      }}
                    >
                      No sessions recorded yet.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const href = `/sessions/${encodeURIComponent(session.session_id)}`;
                    return (
                      <tr key={session.session_id} className="row">
                        <td className="td">
                          <CellLink href={href}>
                            {fmtDate(session.started_at)}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {session.shop_name ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {session.device ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <ReferrerToggle referrer={session.referrer} />
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {utmSourceFromReferrer(session.referrer)}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href} mono>
                            {session.entry_model_id ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {String(Number(session.event_count ?? 0))}
                          </CellLink>
                        </td>
                        <td className="td">
                          {session.lead_id ? (
                            <div
                              style={{
                                padding:
                                  "var(--pad-cell-y) var(--pad-cell-x)",
                              }}
                            >
                              <Link
                                href={`/leads/${session.lead_id}`}
                                className="chip"
                              >
                                Converted
                              </Link>
                            </div>
                          ) : (
                            <span
                              style={{
                                display: "block",
                                padding:
                                  "var(--pad-cell-y) var(--pad-cell-x)",
                                color: "var(--muted-2)",
                              }}
                            >
                              Not converted
                            </span>
                          )}
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {fmtDate(session.last_seen_at)}
                          </CellLink>
                        </td>
                        <td className="td">
                          <div
                            style={{
                              padding:
                                "var(--pad-cell-y) var(--pad-cell-x)",
                            }}
                          >
                            <Link href={href} className="chip">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
