'use client';

import { useActionState } from 'react';
import { actualizarClienteAction, ClienteFormState } from '../../actions';

interface ClienteDetalle {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  telefono: string | null;
  genero: string | null;
  estado_cliente: string;
  observaciones: string | null;
}

const initialState: ClienteFormState = { error: null };

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 8,
};

export default function EditarClienteForm({ cliente }: { cliente: ClienteDetalle }) {
  const actionWithId = actualizarClienteAction.bind(null, cliente.id);
  const [state, formAction, isPending] = useActionState(actionWithId, initialState);

  return (
    <div className="card">
      <form action={formAction}>
        <SectionLabel>Datos personales</SectionLabel>

        <Field label="Nombre" name="nombre" defaultValue={cliente.nombre} required />
        <Field label="Apellido paterno" name="apellido_paterno" defaultValue={cliente.apellido_paterno ?? ''} />
        <Field label="Apellido materno" name="apellido_materno" defaultValue={cliente.apellido_materno ?? ''} />
        <Field label="Teléfono" name="telefono" type="tel" defaultValue={cliente.telefono ?? ''} />

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Género</label>
          <select name="genero" className="form-input" defaultValue={cliente.genero ?? ''}>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <SectionLabel>Estado del cliente</SectionLabel>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Estado</label>
          <select name="estado_cliente" className="form-input" defaultValue={cliente.estado_cliente} required>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <Field label="Observaciones (opcional)" name="observaciones" defaultValue={cliente.observaciones ?? ''} />

        {state.error && <p className="error-message" style={{ marginBottom: 12 }}>{state.error}</p>}

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}

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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={labelStyle}>
        {label}
      </label>
      <input id={name} name={name} type={type} className="form-input" required={required} defaultValue={defaultValue} />
    </div>
  );
}
