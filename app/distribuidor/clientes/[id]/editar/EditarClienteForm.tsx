'use client';

import { useActionState } from 'react';
import { actualizarClienteAction, ClienteFormState } from '../../actions';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  telefono: string | null;
  genero: string | null;
}

interface ClienteRaw {
  id: number;
  persona: PersonaRaw;
}

const initialState: ClienteFormState = { error: null };

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 8,
};

export default function EditarClienteForm({ cliente }: { cliente: ClienteRaw }) {
  const actionWithId = actualizarClienteAction.bind(null, cliente.id);
  const [state, formAction, isPending] = useActionState(actionWithId, initialState);

  return (
    <div className="card">
      <form action={formAction}>
        <SectionLabel>Datos personales</SectionLabel>

        <Field label="Nombre" name="nombre" defaultValue={cliente.persona?.nombre ?? ''} required />
        <Field label="Apellido paterno" name="apellido_paterno" defaultValue={cliente.persona?.apellidoPaterno ?? ''} />
        <Field label="Apellido materno" name="apellido_materno" defaultValue={cliente.persona?.apellidoMaterno ?? ''} />
        <Field label="Teléfono" name="telefono" type="tel" defaultValue={cliente.persona?.telefono ?? ''} />

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Género</label>
          <select name="genero" className="form-input" defaultValue={cliente.persona?.genero ?? ''}>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <SectionLabel>Dirección (opcional)</SectionLabel>
        <p style={{ fontSize: 12, color: 'var(--text-placeholder)', marginBottom: 14 }}>
          Solo llena los campos que quieras actualizar. Los que dejes en blanco no se modifican.
        </p>

        <Field label="Estado" name="estado" />
        <Field label="Municipio" name="municipio" />
        <Field label="Código postal" name="codigo_postal" />
        <Field label="Colonia" name="colonia" />
        <Field label="Calle" name="calle" />
        <Field label="Número exterior" name="numero_exterior" />
        <Field label="Número interior" name="numero_interior" />
        <Field label="Referencia" name="referencia" />

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