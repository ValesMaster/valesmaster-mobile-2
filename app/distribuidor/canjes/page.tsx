import { getSession } from '@/lib/session';
import { backendPost } from '@/lib/backend';

interface Canje {
  puntos: number;
  fecha: string;
}

interface CanjesData {
  puntos_disponibles: number;
  canjes: Canje[];
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function CanjesPage() {
  const { userId } = await getSession();

  const { ok, data, message } = await backendPost<CanjesData>('/api/distribuidoras/consultar/canjes', {
    usuario_id: userId,
  });

  if (!ok || !data) {
    return (
      <div className="card">
        <p style={{ color: '#D9A3A3' }}>{message ?? 'No se pudo cargar tu historial de canjes.'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Puntos disponibles</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{Number(data.puntos_disponibles).toLocaleString()} pts</div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 0' }}>
        Canjes realizados
      </div>

      <div className="card" style={{ padding: '8px 20px' }}>
        {data.canjes.length === 0 ? (
          <div style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-placeholder)' }}>
            Aún no has realizado canjes.
          </div>
        ) : (
          data.canjes.map((canje, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < data.canjes.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Canje de puntos</div>
                <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>{formatFecha(canje.fecha)}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>-{Number(canje.puntos).toLocaleString()} pts</div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
