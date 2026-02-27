import { fetchLead } from "@/lib/leads";
import { getAuthHeaders } from "@/lib/auth";
import JsonToggle from "@/components/JsonToggle";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeadCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authHeaders = await getAuthHeaders();
  const lead = await fetchLead(id, authHeaders);
  const paramsData = lead.campaign_params || {};

  // Convert object to array of [key, value] for easier mapping
  const entries = Object.entries(paramsData);

  return (
    <main className="app">
      <div className="container">
        <header className="topbar">
          <div>
            <h1 className="title">Campaign Parameters</h1>
            <p className="subtitle mono" style={{ fontSize: 12 }}>{id}</p>
          </div>
          <Link href={`/leads/${id}`} className="btn">
            ← Back to Lead
          </Link>
        </header>

        <section className="card">
          {entries.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
              No campaign parameters found.
            </div>
          ) : (
            <div className="fields">
              {entries.map(([key, value]) => (
                <div key={key} className="field">
                  <div className="fieldLabel">{key.replace(/_/g, " ")}</div>
                  <div className="fieldValue mono">{String(value)}</div>
                </div>
              ))}
              <div style={{ padding: 20, borderTop: "1px solid var(--border-soft)" }}>
                <JsonToggle data={paramsData} title="Full Campaign Data" />
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
