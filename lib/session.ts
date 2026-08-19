import { cookies } from 'next/headers';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 8, // 8 horas, igual que la expiración del JWT
};

export async function setSession(data: { accessToken: string; userId: number; userRol: string }) {
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.accessToken, COOKIE_OPTIONS);
  cookieStore.set('user_id', String(data.userId), COOKIE_OPTIONS);
  cookieStore.set('user_rol', data.userRol, COOKIE_OPTIONS);
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? null;
  const userId = cookieStore.get('user_id')?.value ?? null;
  const userRol = cookieStore.get('user_rol')?.value ?? null;

  return {
    accessToken,
    userId: userId ? Number(userId) : null,
    userRol,
    isAuthenticated: Boolean(accessToken),
  };
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('user_id');
  cookieStore.delete('user_rol');
}
