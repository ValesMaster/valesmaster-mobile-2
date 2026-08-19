const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:2552';

export interface BackendResponse<T = unknown> {
  ok: boolean;
  status: number;
  message?: string;
  data?: T;
}

/**
 * POST genérico hacia el backend de Node/Express.
 * Todas tus rutas reales (auth, distribuidoras) son POST con body JSON.
 */
export async function backendPost<T = unknown>(
  path: string,
  body: Record<string, unknown>
): Promise<BackendResponse<T>> {
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));

    return {
      ok: res.ok,
      status: res.status,
      message: json.message,
      data: json.data as T,
    };
  } catch {
    return { ok: false, status: 0, message: 'No se pudo conectar con el servidor.' };
  }
}
