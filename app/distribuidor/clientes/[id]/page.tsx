import Link from 'next/link';
import { notFound } from 'next/navigation';
import { backendGet } from '@/lib/backend';
import DeleteButton from './DeleteButton';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  telefono: string | null;
  genero: string | null;
}

interface ClienteRaw {
  id: number;
  estado: string | null;
  observaciones: string | null;
  persona: PersonaRaw;
}

export default async function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { ok, data } = await backendGet<ClienteRaw>(`/api/distribuidoras/obtener/cliente/${id}`);

  if (!ok || !data) {
    notFound();
  }

  const nombreCompleto = [data.persona?.nombre, data.persona?.apellidoPaterno, data.persona?.apellidoMaterno]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>{nombreCompleto || 'Sin nombre'}</div>
        <div style={{ marginTop: 10 }}>
          <span className={data.estado === 'ACTIVO' ? 'badge badge-success' : 'badge badge-neutral'}>
            {data.estado === 'ACTIVO' ? 'Activo' : (data.estado ?? 'Inactivo')}
          </span>
        </div>
      </div>

      <div className="card">
        <Row label="Teléfono" value={data.persona?.telefono ?? 'No registrado'} />
        <Row label="Género" value={data.persona?.genero ?? 'No registrado'} />
        {data.observaciones && (
          <div style={{ padding: '6px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Observaciones</div>
            <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>{data.observaciones}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Link
          href={`/distribuidor/clientes/${data.id}/editar`}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 14,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            textDecoration: 'none',
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Editar
        </Link>

        {data.estado === 'ACTIVO' && <DeleteButton clienteId={data.id} />}
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