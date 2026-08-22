import Link from 'next/link';
import { backendPost } from '@/lib/backend';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  telefono: string | null;
}

interface ClienteRaw {
  id: number;
  estado: string | null;
  persona: PersonaRaw;
}

export default async function ClientesPage() {
  const { ok, data, message } = await backendPost<ClienteRaw[]>('/api/distribuidoras/consultar/clientes', {});

  if (!ok || !data) {
    return (
      <div className="card">
        <p style={{ color: '#D9A3A3' }}>{message ?? 'No se pudo cargar tu lista de clientes.'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Clientes activos</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{data.length}</div>
      </div>

      <Link
        href="/distribuidor/clientes/nuevo"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
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
        + Agregar cliente
      </Link>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 0' }}>
        Listado de clientes
      </div>

      <div className="card" style={{ padding: '8px 20px' }}>
        {data.length === 0 ? (
          <div style={{ padding: '14px 0', fontSize: 12, color: 'var(--text-placeholder)' }}>
            Aún no tienes clientes registrados.
          </div>
        ) : (
          data.map((cliente, i) => {
            const nombre = [cliente.persona?.nombre, cliente.persona?.apellidoPaterno]
              .filter(Boolean)
              .join(' ') || 'Sin nombre';

            return (
              <Link
                key={cliente.id}
                href={`/distribuidor/clientes/${cliente.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < data.length - 1 ? '1px solid var(--color-border)' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{nombre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>
                    {cliente.persona?.telefono ?? 'Sin teléfono'}
                  </div>
                </div>
                <span className={cliente.estado === 'ACTIVO' ? 'badge badge-success' : 'badge badge-neutral'}>
                  {cliente.estado === 'ACTIVO' ? 'Activo' : (cliente.estado ?? 'Inactivo')}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}