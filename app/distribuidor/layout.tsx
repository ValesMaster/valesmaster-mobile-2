import Link from 'next/link';
import { logoutAction } from '../login/actions';
import NavLink from './NavLink';

export default function DistribuidorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px',
          backgroundColor: 'var(--color-primary)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link href="/distribuidor" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>VALES MASTER</div>
          </div>
        </Link>

        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Cerrar sesión"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 6 }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </header>

      <main style={{ flex: 1, padding: '20px 16px 100px 16px', maxWidth: 480, width: '100%', margin: '0 auto' }}>
        {children}
      </main>

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: 'var(--color-primary)',
          borderTop: '1px solid var(--color-border)',
          padding: '10px 8px calc(10px + env(safe-area-inset-bottom)) 8px',
          zIndex: 10,
        }}
      >
        <NavLink href="/distribuidor" label="Inicio" icon="home" />
        <NavLink href="/distribuidor/estado-cuenta" label="Cuenta" icon="wallet" />
        <NavLink href="/distribuidor/canjes" label="Canjes" icon="repeat" />
        <NavLink href="/distribuidor/clientes" label="Clientes" icon="users" />
      </nav>
    </div>
  );
}
