import Viewer3DComponent from "@/components/Viewer3DComponent/Viewer3DComponent";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  customer_name: string | null;
  customer_phone_number: string | null;
  customer_email: string | null;
  ring_model_id: string | null;
  ring_name: string | null;
  diamond_cut: string | null;
  diamond_info: any;
  metal_color: string | null;
  price_setting: string | null;
  total_price: string | number | null;
  created_at: string;
  updated_at: string;
  origin: string;
  consent: string | null;
  smsConsent: string | null;
  steps_tracker: any;
  purchase_timeline: string | null;
  preffered_location: string | null;
};

async function fetchLead(id: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL(`/leads/${id}`, base);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch lead: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.lead as Lead;
}

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
                ) : lead.preffered_location ? (
                  "Expert Consultation Form submitted before selecting any diamond info."
                ) : (
                  "Intermediate (Diamond Info not selected yet)"
                )
              }
            />

            <Field label="Metal Color" value={lead.metal_color} />
            <Field label="Price Setting" value={lead.price_setting} />
            <Field label="Total Price" value={lead.total_price} />
            <Field label="Origin" value={lead.origin} />
            <Field label="Consent" value={lead.consent} />
            <Field label="SMS Consent" value={lead.smsConsent} />
            <Field label="Preferred Location" value={lead.preffered_location} />
            <Field label="Timeline of Purchase" value={lead.purchase_timeline} />
            <Field
              label="Steps Logger"
              value={
                lead.steps_tracker ? (
                  <pre className="pre mono">
                    {JSON.stringify(lead.steps_tracker, null, 2)}
                  </pre>
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
