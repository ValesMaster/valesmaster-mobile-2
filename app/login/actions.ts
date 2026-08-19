'use server';

import { redirect } from 'next/navigation';
import { decodeJwtPayload } from '@/lib/jwt';
import { setSession } from '@/lib/session';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:2552';

export interface LoginState {
  error: string | null;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Credenciales inválidas.' };
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch {
    return { error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 403) {
    return { error: data.message ?? 'Cuenta bloqueada temporalmente.' };
  }

  if (response.status === 401) {
    return { error: data.message ?? 'Credenciales inválidas.' };
  }

  if (!response.ok) {
    return { error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
  }

  if (data.step === 'COMPLETED') {
    const payload = decodeJwtPayload(data.accessToken);

    if (!payload) {
      return { error: 'Respuesta inesperada del servidor.' };
    }

    if (payload.rol !== 'distribuidora') {
      return { error: 'Tu cuenta no tiene acceso a la aplicación móvil todavía.' };
    }

    await setSession({
      accessToken: data.accessToken,
      userId: payload.id,
      userRol: payload.rol,
    });

    redirect('/distribuidor');
  }

  if (data.step === 'REQUIRE_TOTP') {
    // TODO: cuando se construya la pantalla de MFA, guardar mfaToken y redirigir ahí.
    return { error: 'Tu cuenta requiere verificación adicional (MFA), pantalla pendiente de construir.' };
  }

  return { error: 'Respuesta inesperada del servidor.' };
}

export async function logoutAction() {
  const { clearSession } = await import('@/lib/session');
  await clearSession();
  redirect('/login');
}
