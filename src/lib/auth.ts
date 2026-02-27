import { cookies } from 'next/headers'

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value ?? null
}

export async function getAuthRole(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_role')?.value ?? null
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}
