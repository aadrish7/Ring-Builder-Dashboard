import Viewer3DComponent from "@/components/Viewer3DComponent/Viewer3DComponent";
import { fetchLead } from "@/lib/leads";
import Link from "next/link";

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

function BoolField({ label, value }: { label: string; value: boolean | null | undefined }) {
  return (
    <div className="field">
      <div className="fieldLabel">{label}</div>
      <div className="fieldValue">
        {value == null ? (
          <span style={{ color: "var(--muted-2)" }}>—</span>
        ) : value ? (
          <span className="pillGreen">Yes</span>
        ) : (
          <span className="pillSlate">No</span>
        )}
      </div>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await fetchLead(id);

  return (
    <main className="app">
      <div className="container">
        {/* ── Page header ── */}
        <header className="topbar">
          <div>
            <h1 className="title">Lead Detail</h1>
            <p
              className="subtitle mono"
              style={{ wordBreak: "break-all", fontSize: 12 }}
            >
              {lead.id}
            </p>
          </div>
          <Link href="/leads" className="btn">
            ← Back to Leads
          </Link>
        </header>

        {/* ── 3D Viewer ── */}
        {lead.ring_model_id && (
          <section className="card" style={{ marginBottom: 16 }}>
            <div className="cardHeader">
              <span className="cardTitle">3D Ring Preview</span>
              <span
                className="mono"
                style={{ fontSize: 12, color: "var(--muted)" }}
              >
                {lead.ring_model_id}
              </span>
            </div>
            <Viewer3DComponent combinedChoice={lead.ring_model_id} />
          </section>
        )}

        {/* ── Details card ── */}
        <section className="card">
          <div className="fields">

            {/* Customer */}
            <div className="fieldSectionTitle">Customer</div>
            <Field label="Name" value={lead.customer_name} />
            <Field label="Phone" value={lead.customer_phone_number} />
            <Field label="Email" value={lead.customer_email} />

            {/* Ring Configuration */}
            <div className="fieldSectionTitle">Ring Configuration</div>
            <Field label="Ring Model ID" value={
              lead.ring_model_id
                ? <span className="mono">{lead.ring_model_id}</span>
                : null
            } />
            <Field label="Ring Name" value={lead.ring_name} />
            <Field label="Diamond Cut" value={lead.diamond_cut} />
            <Field
              label="Diamond Info"
              value={
                lead.diamond_info ? (
                  <pre className="pre mono">
                    {JSON.stringify(lead.diamond_info, null, 2)}
                  </pre>
                ) : lead.preferred_location ? (
                  "Expert Consultation Form submitted — diamond info not yet selected."
                ) : (
                  <span style={{ color: "var(--muted)" }}>
                    Intermediate — diamond info not selected yet
                  </span>
                )
              }
            />
            <Field label="Metal Color" value={lead.metal_color} />
            <Field label="Price Setting" value={lead.price_setting} />
            <Field
              label="Total Price"
              value={
                lead.total_price
                  ? <strong>${lead.total_price}</strong>
                  : null
              }
            />

            {/* Sales Engagement */}
            <div className="fieldSectionTitle">Sales Engagement</div>
            <BoolField label="Consent" value={lead.consent} />
            <BoolField label="SMS Consent" value={lead.sms_consent} />
            <Field label="Preferred Location" value={lead.preferred_location} />
            <Field label="Purchase Timeline" value={lead.purchase_timeline} />

            {/* Metadata */}
            <div className="fieldSectionTitle">Metadata</div>
            <Field label="Shop" value={lead.shop_name} />
            <Field label="Created" value={fmtDate(lead.created_at)} />
            <Field label="Updated" value={fmtDate(lead.updated_at)} />

            {/* Related Data */}
            <div className="fieldSectionTitle">Related Data</div>
            <Field
              label="Steps Tracker"
              value={
                lead.steps_tracker?.journey?.length ? (
                  <Link
                    href={`/leads/${lead.id}/steps`}
                    className="chip"
                  >
                    View {lead.steps_tracker.journey.length} steps →
                  </Link>
                ) : null
              }
            />
            <Field
              label="Campaign Params"
              value={
                lead.campaign_params &&
                Object.keys(lead.campaign_params).length > 0 ? (
                  <Link
                    href={`/leads/${lead.id}/campaign`}
                    className="chip"
                  >
                    View campaign data →
                  </Link>
                ) : null
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}
