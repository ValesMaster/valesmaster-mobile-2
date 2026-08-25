import { notFound } from 'next/navigation';
import { backendGet } from '@/lib/backend';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
}

interface PagoRaw {
  id: number;
  quincena: number;
  estado: string;
  fechaCorte: string;
  fechaPago: string | null;
  cantidadAPagar: number;
  cantidadPagada: number;
}

interface ValeDetalleRaw {
  id: number;
  cantidadPrestada: number;
  cantidadPagada: number;
  estado: string;
  plazos: number;
  tipoVale: string;
  cliente: { persona: PersonaRaw };
  pagos: PagoRaw[];
}

function badgeClase(estado: string) {
  if (estado === 'VIGENTE' || estado === 'PAGADO') return 'badge badge-success';
  if (estado === 'ATRASADO') return 'badge badge-warning';
  return 'badge badge-neutral';
}

function badgeTexto(estado: string) {
  const textos: Record<string, string> = {
    VIGENTE: 'Vigente',
    LIQUIDADO: 'Liquidado',
    PENDIENTE: 'Pendiente',
    PAGADO: 'Pagado',
    ATRASADO: 'Atrasado',
  };
  return textos[estado] ?? estado;
}

function formatFecha(fecha: string | null) {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function ValeDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ok, data } = await backendGet<ValeDetalleRaw>(`/api/vales/detalle/${id}`);

  if (!ok || !data) {
    notFound();
  }

  const nombreCompleto =
    [data.cliente?.persona?.nombre, data.cliente?.persona?.apellidoPaterno, data.cliente?.persona?.apellidoMaterno]
      .filter(Boolean)
      .join(' ') || 'Sin nombre';

  const saldoPendiente = Number(data.cantidadPrestada) - Number(data.cantidadPagada);

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{nombreCompleto}</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          ${Number(data.cantidadPrestada).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
        <div style={{ marginTop: 10 }}>
          <span className={badgeClase(data.estado)}>{badgeTexto(data.estado)}</span>
        </div>
      </div>

      <div className="card">
        <Row label="Pagado" value={`$${Number(data.cantidadPagada).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
        <Row label="Saldo pendiente" value={`$${saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`} />
        <Row label="Plazos" value={`${data.plazos} quincenas`} />
        <Row label="Tipo" value={data.tipoVale === 'EFECTIVO' ? 'Efectivo' : 'Mercancía'} />
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
        Calendario de pagos
      </div>

      <div className="card" style={{ padding: '8px 20px' }}>
        {data.pagos.map((pago, i) => (
          <div
            key={pago.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: i < data.pagos.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Quincena {pago.quincena}</div>
              <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>
                Corte: {formatFecha(pago.fechaCorte)}
                {pago.fechaPago && ` · Pagado: ${formatFecha(pago.fechaPago)}`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                ${Number(pago.cantidadAPagar).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <span className={badgeClase(pago.estado)}>{badgeTexto(pago.estado)}</span>
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
