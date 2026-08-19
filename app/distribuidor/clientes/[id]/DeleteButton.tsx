'use client';

import { eliminarClienteAction } from '../actions';

export default function DeleteButton({ clienteId }: { clienteId: number }) {
  return (
    <form
      action={() => eliminarClienteAction(clienteId)}
      style={{ flex: 1 }}
      onSubmit={(e) => {
        if (!confirm('¿Seguro que quieres eliminar a este cliente? Esta acción no se puede deshacer.')) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: 14,
          background: 'transparent',
          border: '1px solid #D9A3A3',
          borderRadius: 8,
          color: '#D9A3A3',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Eliminar
      </button>
    </form>
  );
}
