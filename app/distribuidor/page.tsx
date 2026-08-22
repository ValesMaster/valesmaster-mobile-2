import Link from 'next/link';
import { backendPost } from '@/lib/backend';

interface PersonaData {
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
}

interface PerfilData {
  id: number;
  categoria: string | null;
  puntos: number;
  limiteCredito: number;
  creditoUsado: number;
  usuario?: {
    activo: boolean;
    persona?: PersonaData;
  };
}

export default async function DashboardPage() {
  const { ok, data, message, timedOut } = await backendPost<PerfilData>('/api/distribuidoras/consultar/perfil', {});

  if (!ok || !data) {
    return (
      <div className="card">
        <p style={{ color: '#D9A3A3', marginBottom: 8 }}>
          {message ?? 'No se pudo cargar tu información.'}
        </p>
        {timedOut && (
          <p style={{ fontSize: 12, color: 'var(--text-placeholder)' }}>
            Este endpoint del backend (consultar/perfil) tiene un problema pendiente de corrección por el equipo de backend.
          </p>
        )}
      </div>
    );
  }

  const persona = data.usuario?.persona;
  const nombreCompleto = [persona?.nombre, persona?.apellidoPaterno, persona?.apellidoMaterno]
    .filter(Boolean)
    .join(' ') || 'Distribuidor';

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Bienvenido</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{nombreCompleto}</div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 4 }}>
          {data.categoria ?? 'Sin categoría'}
        </div>
        <div style={{ marginTop: 12 }}>
          <span className={data.usuario?.activo ? 'badge badge-success' : 'badge badge-warning'}>
            {data.usuario?.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
          </span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Puntos disponibles</div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{Number(data.puntos ?? 0).toLocaleString()} pts</div>
        <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 4 }}>
          Crédito usado: ${Number(data.creditoUsado ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} de $
          {Number(data.limiteCredito ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '20px 0 10px 0' }}>
        Accesos rápidos
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MenuItem href="/distribuidor/estado-cuenta" label="Estado de cuenta" desc="Próximamente" />
        <MenuItem href="/distribuidor/canjes" label="Historial de canjes" desc="Próximamente" />
        <MenuItem href="/distribuidor/clientes" label="Mis clientes" desc="Gestiona tus clientes" />
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