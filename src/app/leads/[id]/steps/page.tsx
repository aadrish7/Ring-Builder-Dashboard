import { fetchLead } from "@/lib/leads";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-US", { timeZone: "America/Chicago" });
}

export default async function LeadStepsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await fetchLead(id);
  const journey = lead.steps_tracker?.journey || [];

  return (
    <main className="app">
      <div className="container">
        <header className="topbar">
          <div>
            <h1 className="title">Lead Steps Tracker</h1>
            <p className="subtitle mono">{id}</p>
          </div>
          <Link href={`/leads/${id}`} className="btn">
            ← Back to Lead
          </Link>
        </header>

        <section className="card">
          {journey.length === 0 ? (
            <div style={{ padding: 20, color: "var(--muted)" }}>
              No steps recorded.
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
                  {journey.map((step, i) => (
                    <tr key={i} className="row">
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>{fmtDate(step.timestamp)}</td>
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>{step.stepName}</td>
                      <td className="td mono" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)", fontSize: 12 }}>
                        {step.eventType}
                      </td>
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>{step.action}</td>
                      <td className="td" style={{ padding: "var(--pad-cell-y) var(--pad-cell-x)" }}>
                        <pre className="pre mono" style={{ maxHeight: 100, overflow: 'auto' }}>
                          {JSON.stringify(step.details, null, 2)}
                        </pre>
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
