import { getSession } from '@/lib/session';
import { backendPost } from '@/lib/backend';

interface Pago {
  monto: number;
  fecha_pago: string | null;
  fecha_corte: string;
  estado: 'pagado' | 'pendiente';
}

interface EstadoCuentaData {
  limite_credito: number;
  credito_usado: number;
  credito_disponible: number;
  pagos: Pago[];
}

function formatFecha(fecha: string | null) {
  if (!fecha) return 'Sin fecha';
  return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function EstadoCuentaPage() {
  const { userId } = await getSession();

  const { ok, data, message } = await backendPost<EstadoCuentaData>('/api/distribuidoras/consultar/estado-cuenta', {
    usuario_id: userId,
  });

  if (!ok || !data) {
    return (
      <div className="card">
        <p style={{ color: '#D9A3A3' }}>{message ?? 'No se pudo cargar tu estado de cuenta.'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Crédito disponible</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          ${Number(data.credito_disponible).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 4 }}>
          Límite total: ${Number(data.limite_credito).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Crédito usado</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          ${Number(data.credito_usado).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 0' }}>
        Historial de pagos
      </div>

      <div className="card" style={{ padding: '8px 20px' }}>
        {data.pagos.length === 0 ? (
          <div style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-placeholder)' }}>
            Aún no hay pagos registrados.
          </div>
        ) : (
          data.pagos.map((pago, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < data.pagos.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  ${Number(pago.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>{formatFecha(pago.fecha_pago)}</div>
              </div>
              <span className={pago.estado === 'pagado' ? 'badge badge-success' : 'badge badge-warning'}>
                {pago.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
