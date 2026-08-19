'use client';

import { useActionState } from 'react';
import { crearClienteAction, ClienteFormState } from '../actions';

const initialState: ClienteFormState = { error: null };

export default function NuevoClientePage() {
  const [state, formAction, isPending] = useActionState(crearClienteAction, initialState);

  return (
    <div className="card">
      <form action={formAction}>
        <SectionLabel>Datos personales</SectionLabel>

        <Field label="Nombre" name="nombre" required />
        <Field label="Apellido paterno" name="apellido_paterno" />
        <Field label="Apellido materno" name="apellido_materno" />
        <Field label="Teléfono" name="telefono" type="tel" placeholder="55 1234 5678" />

        <div style={{ marginBottom: 16 }}>
          <label className="field-label" style={labelStyle}>Género</label>
          <select name="genero" className="form-input">
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <SectionLabel>Dirección</SectionLabel>

        <Field label="Estado" name="estado" required />
        <Field label="Municipio" name="municipio" required />
        <Field label="Código postal" name="codigo_postal" required />
        <Field label="Colonia" name="colonia" required />
        <Field label="Calle" name="calle" required />
        <Field label="Número exterior" name="numero_exterior" required />
        <Field label="Número interior (opcional)" name="numero_interior" />
        <Field label="Referencia (opcional)" name="referencia" />

        {state.error && <p className="error-message" style={{ marginBottom: 12 }}>{state.error}</p>}

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Creando...' : 'Crear cliente'}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 8,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 0 14px 0' }}>
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>
      <input id={name} name={name} type={type} className="form-input" required={required} placeholder={placeholder} />
    </div>
  );
}
