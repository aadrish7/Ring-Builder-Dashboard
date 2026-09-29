import { fetchSession } from "@/lib/sessions";
import { getAuthHeaders } from "@/lib/auth";
import JsonToggle from "@/components/JsonToggle";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-US", { timeZone: "America/Chicago" });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  const empty =
    value === null || value === undefined || value === "" || value === false;
  return (
    <div className="field">
      <div className="fieldLabel">{label}</div>
      <div className="fieldValue">
        {empty ? <span style={{ color: "var(--muted-2)" }}>—</span> : value}
      </div>
    </div>
  );
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const authHeaders = await getAuthHeaders();
  const { session, events } = await fetchSession(sessionId, authHeaders);

  const hasCampaign =
    !!session.campaign_params &&
    Object.keys(session.campaign_params).length > 0;

  return (
    <main className="app">
      <div className="container">
        <header className="topbar">
          <div>
            <h1 className="title">Session Journey</h1>
            <p className="subtitle mono" style={{ fontSize: 12 }}>{sessionId}</p>
          </div>
          <Link href="/sessions" className="btn">
            ← Back to Sessions
          </Link>
        </header>

        {/* ── Session metadata ── */}
        <section className="card" style={{ marginBottom: 16 }}>
          <div className="fields">
            <div className="fieldSectionTitle">Session</div>
            <Field label="Shop ID" value={<span className="mono">{session.shop_id}</span>} />
            <Field label="Device" value={session.device} />
            <Field label="Referrer" value={session.referrer} />
            <Field
              label="Entry Model ID"
              value={
                session.entry_model_id
                  ? <span className="mono">{session.entry_model_id}</span>
                  : null
              }
            />
            <Field label="Started" value={fmtDate(session.started_at)} />
            <Field label="Last Seen" value={fmtDate(session.last_seen_at)} />

            <div className="fieldSectionTitle">Conversion</div>
            <Field
              label="Lead"
              value={
                session.lead_id ? (
                  <Link href={`/leads/${session.lead_id}`} className="chip">
                    View Lead →
                  </Link>
                ) : (
                  <span style={{ color: "var(--muted-2)" }}>Not converted</span>
                )
              }
            />
            <Field
              label="Campaign Params"
              value={
                hasCampaign ? (
                  <pre className="pre mono" style={{ maxHeight: 200, overflow: "auto" }}>
                    {JSON.stringify(session.campaign_params, null, 2)}
                  </pre>
                ) : null
              }
            />
          </div>
        </section>

        {/* ── Events timeline ── */}
        <section className="card">
          {events.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted)" }}>
              No events recorded for this session.
            </div>
          ) : (
            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th className="th" style={{ width: 180 }}>Time</th>
                    <th className="th" style={{ width: 120 }}>Step</th>
                    <th className="th" style={{ width: 140 }}>Event Type</th>
                    <th className="th" style={{ width: 200 }}>Action</th>
                    <th className="th">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="row">
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>
                        {fmtDate(event.client_ts ?? event.created_at)}
                      </td>
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>{event.step_name}</td>
                      <td className="td mono" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)", fontSize: 12 }}>
                        {event.event_type}
                      </td>
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>{event.action}</td>
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>
                        <pre className="pre mono" style={{ maxHeight: 100, overflow: 'auto' }}>
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                        {event.event_type === 'price_update' && event.model_id && (
                          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
                            <span style={{ fontWeight: 600 }}>Updated Model ID:</span> <span className="mono">{event.model_id}</span>
                          </div>
                        )}
                        <JsonToggle data={event} title="Full Event Data" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
