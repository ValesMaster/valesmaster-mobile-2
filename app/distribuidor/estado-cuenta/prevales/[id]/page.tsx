import Link from 'next/link';
import { notFound } from 'next/navigation';
import { backendGet } from '@/lib/backend';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
}

interface DetallePagoRaw {
  id: number;
  quincena: number;
  cantidadEstimada: number;
}

interface ValeRaw {
  id: number;
}

interface PrevaleDetalleRaw {
  id: number;
  cantidadSolicitada: number;
  plazos: number;
  tipoVale: string;
  estado: string;
  motivoRechazo: string | null;
  cliente: { persona: PersonaRaw };
  coordinador: { usuario: { username: string } } | null;
  detallesPagos: DetallePagoRaw[];
  vales: ValeRaw[];
}

function badgeClase(estado: string) {
  if (estado === 'APROBADO') return 'badge badge-success';
  if (estado === 'RECHAZADO') return 'badge badge-warning';
  return 'badge badge-neutral';
}

function badgeTexto(estado: string) {
  const textos: Record<string, string> = { PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', RECHAZADO: 'Rechazado' };
  return textos[estado] ?? estado;
}

export default async function PrevaleDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ok, data } = await backendGet<PrevaleDetalleRaw>(`/api/vales/prevales/detalle/${id}`);

  if (!ok || !data) {
    notFound();
  }

  const nombreCompleto =
    [data.cliente?.persona?.nombre, data.cliente?.persona?.apellidoPaterno, data.cliente?.persona?.apellidoMaterno]
      .filter(Boolean)
      .join(' ') || 'Sin nombre';

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{nombreCompleto}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          ${Number(data.cantidadSolicitada).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ marginTop: 10 }}>
          <span className={badgeClase(data.estado)}>{badgeTexto(data.estado)}</span>
        </div>
      </div>

      {data.estado === 'RECHAZADO' && data.motivoRechazo && (
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Motivo de rechazo</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{data.motivoRechazo}</div>
        </div>
      )}

      {data.estado === 'APROBADO' && data.vales?.[0] && (
        <Link
          href={`/distribuidor/estado-cuenta/${data.vales[0].id}`}
          style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            padding: 14,
            marginBottom: 16,
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Ver vale generado
        </Link>
      )}

      <div className="card">
        <Row label="Plazos" value={`${data.plazos} quincenas`} />
        <Row label="Tipo" value={data.tipoVale === 'EFECTIVO' ? 'Efectivo' : 'Mercancía'} />
        <Row label="Coordinador asignado" value={data.coordinador?.usuario?.username ?? 'Sin asignar'} />
      </div>

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
        Calendario estimado
      </div>

      <div className="card" style={{ padding: '8px 20px' }}>
        {data.detallesPagos.map((detalle, i) => (
          <div
            key={detalle.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: i < data.detallesPagos.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>Quincena {detalle.quincena}</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              ${Number(detalle.cantidadEstimada).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
