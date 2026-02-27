import { fetchLeads } from "@/lib/leads";
import { getAuthHeaders, getAuthRole } from "@/lib/auth";
import Link from "next/link";
import ShopFilter from "@/components/ShopFilter";

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

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return (
    d.toLocaleDateString("en-US", opts) ===
    now.toLocaleDateString("en-US", opts)
  );
}

function MetalBadge({ color }: { color: string | null }) {
  if (!color) return <span style={{ color: "var(--muted-2)" }}>—</span>;

  const map: Record<string, string> = {
    "Yellow Gold": "pillAmber",
    "White Gold": "pillSlate",
    "Rose Gold": "pillRose",
    Platinum: "pillSlate",
  };

  const cls = map[color] ?? "pill";
  return <span className={cls}>{color}</span>;
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

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; shop?: string }>;
}) {
  const sp = await searchParams;
  const q = sp?.q ?? "";
  const selectedShop = sp?.shop ?? "";

  const [authHeaders, role] = await Promise.all([getAuthHeaders(), getAuthRole()]);
  const isSuperAdmin = role === 'super_admin';

  const data = await fetchLeads({ q, limit: 50 }, authHeaders);

  // Unique shops from all fetched leads (for the dropdown — super_admin only)
  const allShops = isSuperAdmin
    ? [...new Set(data.leads.map((l) => l.shop_name).filter(Boolean) as string[])].sort()
    : [];

  // Apply shop filter (super_admin client-side; admin sees only their shop already)
  const leads = isSuperAdmin && selectedShop
    ? data.leads.filter((l) => l.shop_name === selectedShop)
    : data.leads;

  // Stats from the current view
  const leadsToday = leads.filter((l) => isToday(l.created_at)).length;
  const completeLeads = leads.filter((l) => !!l.diamond_info).length;
  const intermediateLeads = leads.filter((l) => !l.diamond_info).length;

  const isFiltered = q.trim().length > 0 || selectedShop.length > 0;

  return (
    <main className="app">
      <div className="container">
        {/* ── Page header ── */}
        <header className="topbar">
          <div>
            <h1 className="title">Engagement Dashboard</h1>
            <p className="subtitle">
              {data.total} leads in database · newest first
            </p>
          </div>

          {isFiltered && (
            <Link href="/leads" className="btn">
              ✕ Clear filters
            </Link>
          )}
        </header>

        {/* ── Stats ── */}
        <div className="statsRow">
          <div className="statCard">
            <div className="statLabel">Total Leads</div>
            <div className="statValue">{data.total}</div>
            <div className="statMeta">all time</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Leads Today</div>
            <div className="statValue">{leadsToday}</div>
            <div className="statMeta">in current view</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Complete</div>
            <div className="statValue">{completeLeads}</div>
            <div className="statMeta">diamond info selected</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Intermediate</div>
            <div className="statValue">{intermediateLeads}</div>
            <div className="statMeta">no diamond info yet</div>
          </div>
        </div>

        {/* ── Filters ── */}
        <form method="GET" action="/leads" className="searchRow">
          {isSuperAdmin && (
            <ShopFilter
              shops={allShops}
              currentShop={selectedShop}
              currentQ={q}
            />
          )}
          <input
            className="input"
            name="q"
            defaultValue={q}
            placeholder="Search by name, phone, email, ring model, or ID…"
            autoComplete="off"
          />
          <button className="btn btnPrimary" type="submit">
            Search
          </button>
        </form>

        {/* ── Table ── */}
        <section className="card">
          <div className="cardHeader">
            <span className="cardTitle">
              {selectedShop ? selectedShop : isFiltered ? "Search Results" : "All Leads"}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {leads.length} of {data.total}
            </span>
          </div>

          <div className="tableWrap">
            <table className="table">
              <colgroup>
                <col style={{ width: 170 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 170 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 130 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 90 }} />
                <col />
              </colgroup>

              <thead>
                <tr>
                  {[
                    "Created",
                    "Shop",
                    "Customer",
                    "Phone",
                    "Email",
                    "Ring Model ID",
                    "Ring Name",
                    "Metal",
                    "Price",
                    "Steps",
                    "Campaign",
                    "Lead ID",
                  ].map((h) => (
                    <th key={h} className="th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "var(--muted)",
                        fontSize: 14,
                      }}
                    >
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const href = `/leads/${lead.id}`;
                    return (
                      <tr key={lead.id} className="row">
                        <td className="td">
                          <CellLink href={href}>
                            {fmtDate(lead.created_at)}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {lead.shop_name ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {lead.customer_name ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {lead.customer_phone_number ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {lead.customer_email ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href} mono>
                            {lead.ring_model_id ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {lead.ring_name ?? ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          <div
                            style={{
                              padding:
                                "var(--pad-cell-y) var(--pad-cell-x)",
                            }}
                          >
                            <MetalBadge color={lead.metal_color} />
                          </div>
                        </td>
                        <td className="td">
                          <CellLink href={href}>
                            {lead.total_price ? `$${lead.total_price}` : ""}
                          </CellLink>
                        </td>
                        <td className="td">
                          {lead.steps_tracker?.journey?.length ? (
                            <div
                              style={{
                                padding:
                                  "var(--pad-cell-y) var(--pad-cell-x)",
                              }}
                            >
                              <Link
                                href={`/leads/${lead.id}/steps`}
                                className="chip"
                              >
                                View
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
                              —
                            </span>
                          )}
                        </td>
                        <td className="td">
                          {lead.campaign_params &&
                          Object.keys(lead.campaign_params).length > 0 ? (
                            <div
                              style={{
                                padding:
                                  "var(--pad-cell-y) var(--pad-cell-x)",
                              }}
                            >
                              <Link
                                href={`/leads/${lead.id}/campaign`}
                                className="chip"
                              >
                                View
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
                              —
                            </span>
                          )}
                        </td>
                        <td className="td">
                          <CellLink href={href} mono>
                            {lead.id}
                          </CellLink>
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
