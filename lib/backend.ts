import { getSession } from './session';

const BACKEND_URL = process.env.BACKEND_URL ?? 'https://pastelito';
const TIMEOUT_MS = 8000;

export interface BackendResponse<T = unknown> {
  ok: boolean;
  status: number;
  message?: string;
  data?: T;
  timedOut?: boolean;
}

async function backendRequest<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: Record<string, unknown>
): Promise<BackendResponse<T>> {
  const { accessToken } = await getSession();

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const json = await res.json().catch(() => ({}));

    return {
      ok: res.ok,
      status: res.status,
      message: json.message,
      data: json.data as T,
    };
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';
    return {
      ok: false,
      status: 0,
      timedOut: isTimeout,
      message: isTimeout
        ? 'El servidor tardó demasiado en responder. Puede que este dato aún no esté disponible.'
        : 'No se pudo conectar con el servidor.',
    };
  }
}

export const backendGet = <T = unknown>(path: string) => backendRequest<T>('GET', path);
export const backendPost = <T = unknown>(path: string, body?: Record<string, unknown>) =>
  backendRequest<T>('POST', path, body);
export const backendPatch = <T = unknown>(path: string, body?: Record<string, unknown>) =>
  backendRequest<T>('PATCH', path, body);