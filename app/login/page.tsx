'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { loginAction, LoginState } from './actions';

const initialState: LoginState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div className="card" style={{ padding: '40px 32px' }}>
          {/* Logo */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--color-accent)',
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
              VALES MASTER
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Iniciar sesión</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Accede a tu cuenta para continuar.</p>
          </div>

          {state.error && (
            <div
              style={{
                background: 'rgba(217, 163, 213, 0.12)',
                border: '1px solid var(--color-accent)',
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              {state.error}
            </div>
          )}

          <form action={formAction}>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="tucorreo@empresa.com"
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-placeholder)',
                    cursor: 'pointer',
                  }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <input type="checkbox" name="remember" />
                Recordarme
              </label>
              <Link href="#" style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
