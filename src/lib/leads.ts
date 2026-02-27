export type Lead = {
  id: string;
  shop_name: string | null;
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
  consent?: boolean | null;
  sms_consent?: boolean | null;
  purchase_timeline?: string | null;
  preferred_location?: string | null;
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

export async function fetchLeads(
  params: { q?: string; limit?: number },
  headers: Record<string, string> = {}
): Promise<LeadsResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL("/engagement/leads", base);
  url.searchParams.set("limit", String(params.limit ?? 50));
  url.searchParams.set("offset", "0");
  if (params.q?.trim()) url.searchParams.set("q", params.q.trim());

  const res = await fetch(url.toString(), { cache: "no-store", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch leads: ${res.status} ${text}`);
  }

  return (await res.json()) as LeadsResponse;
}

export async function fetchLead(
  id: string,
  headers: Record<string, string> = {}
): Promise<Lead> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL(`/engagement/leads/${id}`, base);

  const res = await fetch(url.toString(), { cache: "no-store", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch lead: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.lead as Lead;
}
