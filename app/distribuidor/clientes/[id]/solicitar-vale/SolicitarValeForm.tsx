'use client';

import { useActionState } from 'react';
import { crearPrevaleAction, PrevaleFormState } from '../../../prevales/actions';

const initialState: PrevaleFormState = { error: null };

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 8,
};

export default function SolicitarValeForm({ clienteId }: { clienteId: number }) {
  const actionWithId = crearPrevaleAction.bind(null, clienteId);
  const [state, formAction, isPending] = useActionState(actionWithId, initialState);

  return (
    <div className="card">
      <form action={formAction}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="tipo_vale" style={labelStyle}>
            Tipo de vale
          </label>
          <select id="tipo_vale" name="tipo_vale" className="form-input" required defaultValue="">
            <option value="" disabled>
              Selecciona
            </option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="MERCANCIA">Mercancía</option>
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="cantidad_solicitada" style={labelStyle}>
            Cantidad solicitada
          </label>
          <input
            id="cantidad_solicitada"
            name="cantidad_solicitada"
            type="number"
            min="1"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            required
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="plazos" style={labelStyle}>
            Plazos (quincenas)
          </label>
          <input
            id="plazos"
            name="plazos"
            type="number"
            min="1"
            max="24"
            className="form-input"
            placeholder="1 a 24"
            required
          />
        </div>

        {state.error && (
          <p className="error-message" style={{ marginBottom: 12 }}>
            {state.error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  );
}
