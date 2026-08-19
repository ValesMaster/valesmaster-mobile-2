import Link from 'next/link';
import { getSession } from '@/lib/session';
import { backendPost } from '@/lib/backend';

interface PerfilData {
  id: number;
  nombre: string;
  categoria: string | null;
  sucursal: string | null;
  estado: string;
  puntos: number;
  limite_credito: number;
  credito_usado: number;
}

export default async function DashboardPage() {
  const { userId } = await getSession();

  const { ok, data, message } = await backendPost<PerfilData>('/api/distribuidoras/consultar/perfil', {
    usuario_id: userId,
  });

  if (!ok || !data) {
    return (
      <div className="card">
        <p style={{ color: '#D9A3A3' }}>{message ?? 'No se pudo cargar tu información.'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Bienvenido</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{data.nombre}</div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 4 }}>
          {data.categoria} · Sucursal {data.sucursal}
        </div>
        <div style={{ marginTop: 12 }}>
          <span className={data.estado === 'activo' ? 'badge badge-success' : 'badge badge-warning'}>
            {data.estado === 'activo' ? 'Cuenta activa' : 'Cuenta inactiva'}
          </span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Puntos disponibles</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{Number(data.puntos).toLocaleString()} pts</div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 4 }}>
          Crédito usado: ${Number(data.credito_usado).toLocaleString('es-MX', { minimumFractionDigits: 2 })} de $
          {Number(data.limite_credito).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 0' }}>
        Accesos rápidos
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MenuItem href="/distribuidor/estado-cuenta" label="Estado de cuenta" desc="Ver detalle de crédito y pagos" />
        <MenuItem href="/distribuidor/canjes" label="Historial de canjes" desc="Puntos canjeados" />
        <MenuItem href="/distribuidor/clientes" label="Mis clientes" desc="Vales y clientes asignados" />
      </div>
    </>
  );
}

function MenuItem({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: '18px 14px',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--text-placeholder)' }}>{desc}</div>
    </Link>
  );
}
