export default function EstadoCuentaPage() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Próximamente</div>
      <p style={{ fontSize: 13, color: 'var(--text-placeholder)' }}>
        El estado de cuenta detallado estará disponible cuando el backend agregue este endpoint.
      </p>
    </div>
  );
}