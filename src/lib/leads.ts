export type Lead = {
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
  origin?: string;
  consent?: string | null;
  smsConsent?: string | null;
  purchase_timeline?: string | null;
  preffered_location?: string | null;
  steps_tracker?: {
    journey: Array<{
      price: number;
      action: string;
      details: any;
      modelId: string;
      stepName: string;
      eventType: string;
      timestamp: string;
    }>;
    sessionId: string;
    startTime: string;
  };
  campaign_params?: {
    referrer?: string;
    utm_term?: string;
    utm_medium?: string;
    utm_source?: string;
    utm_content?: string;
    utm_campaign?: string;
    [key: string]: string | undefined;
  };
};

export type LeadsResponse = {
  total: number;
  limit: number;
  offset: number;
  leads: Lead[];
};

export async function fetchLead(id: string): Promise<Lead> {
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
