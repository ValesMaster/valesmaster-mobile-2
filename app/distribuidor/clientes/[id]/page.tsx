import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import { backendPost } from '@/lib/backend';
import DeleteButton from './DeleteButton';

interface Vale {
  id: number;
  cantidad_prestada: number;
  cantidad_pagada: number;
  estado: string;
}

interface Direccion {
  estado: string;
  municipio: string;
  codigo_postal: string;
  colonia: string;
  calle: string;
  numero_exterior: string;
  numero_interior: string | null;
  referencia: string | null;
}

interface ClienteDetalle {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  telefono: string | null;
  genero: string | null;
  estado_cliente: string;
  observaciones: string | null;
  direccion: Direccion | null;
  vales: Vale[];
}

export default async function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await getSession();

  const { ok, data } = await backendPost<ClienteDetalle>('/api/distribuidoras/consultar/cliente', {
    usuario_id: userId,
    cliente_id: Number(id),
  });

  if (!ok || !data) {
    notFound();
  }

  const nombreCompleto = [data.nombre, data.apellido_paterno, data.apellido_materno].filter(Boolean).join(' ');

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 18, fontWeight: 700 }}>{nombreCompleto}</div>
        <div style={{ marginTop: 10 }}>
          <span className={data.estado_cliente === 'ACTIVO' ? 'badge badge-success' : 'badge badge-neutral'}>
            {data.estado_cliente === 'ACTIVO' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="card">
        <Row label="Teléfono" value={data.telefono ?? 'No registrado'} />
        <Row label="Género" value={data.genero ?? 'No registrado'} />
        {data.observaciones && (
          <div style={{ padding: '6px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Observaciones</div>
            <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>{data.observaciones}</div>
          </div>
        )}
      </div>

      {data.direccion && (
        <>
          <SectionLabel>Dirección</SectionLabel>
          <div className="card">
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {data.direccion.calle} {data.direccion.numero_exterior}
              {data.direccion.numero_interior && ` Int. ${data.direccion.numero_interior}`}
              <br />
              {data.direccion.colonia}, {data.direccion.codigo_postal}
              <br />
              {data.direccion.municipio}, {data.direccion.estado}
              {data.direccion.referencia && (
                <>
                  <br />
                  <span style={{ color: 'var(--text-placeholder)' }}>Ref: {data.direccion.referencia}</span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <SectionLabel>Vales</SectionLabel>
      <div className="card" style={{ padding: '8px 20px' }}>
        {data.vales.length === 0 ? (
          <div style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-placeholder)' }}>
            Este cliente no tiene vales registrados.
          </div>
        ) : (
          data.vales.map((vale, i) => (
            <div
              key={vale.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < data.vales.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Vale #{vale.id}</div>
                <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>
                  ${Number(vale.cantidad_pagada).toLocaleString('es-MX', { minimumFractionDigits: 2 })} pagado de $
                  {Number(vale.cantidad_prestada).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <span className="badge badge-neutral">{vale.estado}</span>
            </div>
          ))
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

        <DeleteButton clienteId={data.id} />
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 0' }}>
      {children}
    </div>
  );
}
