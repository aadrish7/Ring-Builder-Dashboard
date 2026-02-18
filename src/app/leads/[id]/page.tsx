import Viewer3DComponent from "@/components/Viewer3DComponent/Viewer3DComponent";
import { fetchLead } from "@/lib/leads";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-US", { timeZone: "America/Chicago" });
}

function Field({ label, value }: { label: string; value: any }) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className="field">
      <div className="fieldLabel">{label}</div>
      <div className="fieldValue">{empty ? "-" : value}</div>
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
        <header className="topbar">
          <div>
            <h1 className="title">Lead Details</h1>
            <p className="subtitle mono" style={{ wordBreak: "break-all" }}>
              {lead.id}
            </p>
          </div>

          <Link href="/leads" className="btn">
            ← Back
          </Link>
        </header>
        <Viewer3DComponent combinedChoice={lead.ring_model_id || ""} />

        <section className="card">
          <div className="fields">
            <Field label="Created" value={fmtDate(lead.created_at)} />
            <Field label="Updated" value={fmtDate(lead.updated_at)} />
            <Field label="Shop" value={lead.shop_name} />

            <Field label="Customer Name" value={lead.customer_name} />
            <Field label="Phone Number" value={lead.customer_phone_number} />
            <Field label="Email" value={lead.customer_email} />

            <Field label="Ring Model ID" value={lead.ring_model_id} />
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
                  "Expert Consultation Form submitted before selecting any diamond info."
                ) : (
                  "Intermediate (Diamond Info not selected yet)"
                )
              }
            />

            <Field label="Metal Color" value={lead.metal_color} />
            <Field label="Price Setting" value={lead.price_setting} />
            <Field label="Total Price" value={lead.total_price} />
            {/* <Field label="Origin" value={lead.origin} /> */}
            <Field label="Consent" value={lead.consent} />
            <Field label="SMS Consent" value={lead.sms_consent} />
            <Field label="Preferred Location" value={lead.preferred_location} />
            <Field label="Timeline of Purchase" value={lead.purchase_timeline} />
            <Field
              label="Steps Logger"
              value={
                lead.steps_tracker ? (
                  <Link href={`/leads/${lead.id}/steps`} className="cellLink" style={{ textDecoration: 'underline' }}>
                    View Steps Timeline
                  </Link>
                ) : (
                  "-"
                )
              }
            />
            <Field
              label="Campaign Params"
              value={
                lead.campaign_params ? (
                  <Link href={`/leads/${lead.id}/campaign`} className="cellLink" style={{ textDecoration: 'underline' }}>
                    View Campaign Params
                  </Link>
                ) : (
                  "-"
                )
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}
