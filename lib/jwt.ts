export interface JwtPayload {
  id: number;
  rol: string;
  [key: string]: unknown;
}

/**
 * Decodifica el payload de un JWT sin verificar la firma
 * (la validación real ya la hizo el backend de Node al emitirlo).
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}
