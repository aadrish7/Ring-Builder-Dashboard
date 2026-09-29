export type Session = {
  session_id: string;
  shop_id: string;
  shop_name?: string | null;
  event_count?: string | number;
  lead_id: string | null;
  device: string | null;
  referrer: string | null;
  entry_model_id: string | null;
  campaign_params: Record<string, string> | null;
  started_at: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
};

export type SessionEvent = {
  id: string;
  event_id: string;
  session_id: string;
  seq: number | null;
  event_type: string;
  step_name: string | null;
  action: string | null;
  model_id: string | null;
  price: number | null;
  details: any;
  client_ts: string | null;
  created_at: string;
};

export type SessionsResponse = {
  total: number;
  limit: number;
  offset: number;
  sessions: Session[];
};

export type SessionStats = {
  total_sessions: number;
  converted_sessions: number;
};

export async function fetchSessions(
  params: { limit?: number; offset?: number },
  headers: Record<string, string> = {}
): Promise<SessionsResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL("/engagement/sessions", base);
  url.searchParams.set("limit", String(params.limit ?? 50));
  url.searchParams.set("offset", String(params.offset ?? 0));

  const res = await fetch(url.toString(), { cache: "no-store", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch sessions: ${res.status} ${text}`);
  }

  return (await res.json()) as SessionsResponse;
}

export async function fetchSessionStats(
  headers: Record<string, string> = {}
): Promise<SessionStats> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL("/engagement/sessions/stats", base);

  const res = await fetch(url.toString(), { cache: "no-store", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch session stats: ${res.status} ${text}`);
  }

  const json = await res.json();
  return {
    total_sessions: Number(json.stats?.total_sessions ?? 0),
    converted_sessions: Number(json.stats?.converted_sessions ?? 0),
  };
}

export async function fetchSession(
  sessionId: string,
  headers: Record<string, string> = {}
): Promise<{ session: Session; events: SessionEvent[] }> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const url = new URL(
    `/engagement/sessions/${encodeURIComponent(sessionId)}`,
    base
  );

  const res = await fetch(url.toString(), { cache: "no-store", headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch session: ${res.status} ${text}`);
  }

  const json = await res.json();
  return {
    session: json.session as Session,
    events: (json.events ?? []) as SessionEvent[],
  };
}
