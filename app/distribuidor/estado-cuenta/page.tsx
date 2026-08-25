import Link from 'next/link';
import { backendGet } from '@/lib/backend';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
}

interface ValeRaw {
  id: number;
  cantidadPrestada: number;
  cantidadPagada: number;
  estado: string;
  plazos: number;
  tipoVale: string;
  cliente: { persona: PersonaRaw };
}

interface PrevaleRaw {
  id: number;
  cantidadSolicitada: number;
  estado: string;
  cliente: { persona: PersonaRaw };
}

function nombreCliente(persona: PersonaRaw | undefined) {
  return [persona?.nombre, persona?.apellidoPaterno].filter(Boolean).join(' ') || 'Sin nombre';
}

function badgeClase(estado: string) {
  if (estado === 'VIGENTE' || estado === 'APROBADO') return 'badge badge-success';
  if (estado === 'RECHAZADO') return 'badge badge-warning';
  return 'badge badge-neutral';
}

function badgeTexto(estado: string) {
  const textos: Record<string, string> = {
    VIGENTE: 'Vigente',
    LIQUIDADO: 'Liquidado',
    PENDIENTE: 'Pendiente',
    APROBADO: 'Aprobado',
    RECHAZADO: 'Rechazado',
  };
  return textos[estado] ?? estado;
}

export default async function EstadoCuentaPage() {
  const [valesRes, prevalesRes] = await Promise.all([
    backendGet<ValeRaw[]>('/api/vales/obtener'),
    backendGet<PrevaleRaw[]>('/api/vales/prevales/obtener'),
  ]);

  if (!valesRes.ok || !valesRes.data) {
    return (
      <div className="card">
        <p style={{ color: '#D9A3A3' }}>{valesRes.message ?? 'No se pudo cargar tu estado de cuenta.'}</p>
      </div>
    );
  }

  const vales = valesRes.data;
  const prevales = prevalesRes.ok && prevalesRes.data ? prevalesRes.data : [];
  const prevalesPendientes = prevales.filter((p) => p.estado === 'PENDIENTE' || p.estado === 'RECHAZADO');

  const valesVigentes = vales.filter((v) => v.estado === 'VIGENTE');
  const totalAdeudado = valesVigentes.reduce(
    (acc, v) => acc + (Number(v.cantidadPrestada) - Number(v.cantidadPagada)),
    0
  );

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Vales vigentes</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{valesVigentes.length}</div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 4 }}>
          Saldo pendiente: ${totalAdeudado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {prevalesPendientes.length > 0 && (
        <>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              margin: '20px 0 10px 0',
            }}
          >
            Solicitudes en proceso
          </div>
          <div className="card" style={{ padding: '8px 20px' }}>
            {prevalesPendientes.map((p, i) => (
              <Link
                key={p.id}
                href={`/distribuidor/estado-cuenta/prevales/${p.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < prevalesPendientes.length - 1 ? '1px solid var(--color-border)' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{nombreCliente(p.cliente?.persona)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>
                    ${Number(p.cantidadSolicitada).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <span className={badgeClase(p.estado)}>{badgeTexto(p.estado)}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          margin: '20px 0 10px 0',
        }}
      >
        Mis vales
      </div>

      <div className="card" style={{ padding: '8px 20px' }}>
        {vales.length === 0 ? (
          <div style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-placeholder)' }}>
            Aún no tienes vales.
          </div>
        ) : (
          vales.map((vale, i) => (
            <Link
              key={vale.id}
              href={`/distribuidor/estado-cuenta/${vale.id}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < vales.length - 1 ? '1px solid var(--color-border)' : 'none',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{nombreCliente(vale.cliente?.persona)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>
                  ${Number(vale.cantidadPrestada).toLocaleString('es-MX', { minimumFractionDigits: 2 })} · {vale.plazos} quincenas
                </div>
              </div>
              <span className={badgeClase(vale.estado)}>{badgeTexto(vale.estado)}</span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
