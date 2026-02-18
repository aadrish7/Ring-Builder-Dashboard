import { fetchLead, Lead, LeadsResponse } from "@/lib/leads";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchLeads(params: { q?: string; limit?: number }) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL("/engagement/leads", base);
  url.searchParams.set("limit", String(params.limit ?? 50));
  url.searchParams.set("offset", "0");
  if (params.q?.trim()) url.searchParams.set("q", params.q.trim());

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch leads: ${res.status} ${text}`);
  }

  return (await res.json()) as LeadsResponse;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-US", { timeZone: "America/Chicago" });
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
      className={`cellLink ${mono ? "mono" : ""}`}
      title={typeof children === "string" ? children : undefined}
    >
      {children}
    </Link>
  );
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = sp?.q ?? "";

  const data = await fetchLeads({ q, limit: 50 });
  // console.log(data)
  return (
    <main className="app">
      <div className="container">
        <header className="topbar">
          <div>
            <h1 className="title">Ring Builder Leads</h1>
            <p className="subtitle">
              Showing <span className="mono">{data.leads.length}</span> of{" "}
              <span className="mono">{data.total}</span> (newest first)
            </p>
          </div>

          <Link href="/leads" className="btn">
            Reset
          </Link>
        </header>

        <form
          method="GET"
          action="/leads"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            className="input"
            name="q"
            defaultValue={q}
            placeholder="Search phone, name, email, ring model id, ring name..."
          />
          <button className="btn" type="submit">
            Search
          </button>
        </form>

        <section className="card" style={{ marginTop: 16 }}>
          <div className="tableWrap">
            <table className="table">
              {/* Ensures header + body share exact widths */}
              <colgroup>
                <col style={{ width: 160 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 220 }} />
                <col style={{ width: 140 }} />
                <col style={{ width: 180 }} />
                <col style={{ width: 120 }} />
                <col style={{ width: 120 }} />
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
                    "Total Price",
                    "Steps",
                    "Campaign",
                    "ID",
                  ].map((h) => (
                    <th key={h} className="th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="td"
                      style={{ padding: 18, color: "var(--muted)" }}
                    >
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  data.leads.map((lead) => {
                    const href = `/leads/${lead.id}`;
                    return (
                      <tr key={lead.id} className="row">
                        <td>
                          <CellLink href={href}>
                            {fmtDate(lead.created_at)}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.shop_name ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.customer_name ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.customer_phone_number ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.customer_email ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.ring_model_id ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.ring_name ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.metal_color ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          <CellLink href={href}>
                            {lead.total_price ?? "-"}
                          </CellLink>
                        </td>
                        <td>
                          {lead.steps_tracker?.journey?.length ? (
                            <Link
                              href={`/leads/${lead.id}/steps`}
                              className="cellLink"
                              style={{ textDecoration: "underline" }}
                            >
                              View Steps
                            </Link>
                          ) : (
                            <span className="cellLink" style={{ color: "var(--muted)" }}>-</span>
                          )}
                        </td>
                        <td>
                          {lead.campaign_params &&
                          Object.keys(lead.campaign_params).length > 0 ? (
                            <Link
                              href={`/leads/${lead.id}/campaign`}
                              className="cellLink"
                              style={{ textDecoration: "underline" }}
                            >
                              View Params
                            </Link>
                          ) : (
                            <span className="cellLink" style={{ color: "var(--muted)" }}>-</span>
                          )}
                        </td>
                        <td>
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

        {/* <p className="subtitle" style={{ marginTop: 14 }}>
          Examples: <span className="mono">?q=solitaire</span>{" "}
          <span className="mono">?q=RB-123</span> <span className="mono">?q=+1</span>
        </p> */}
      </div>
    </main>
  );
}
