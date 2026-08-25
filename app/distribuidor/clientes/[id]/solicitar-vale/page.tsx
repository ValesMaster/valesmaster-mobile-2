import { notFound } from 'next/navigation';
import { backendGet } from '@/lib/backend';
import SolicitarValeForm from './SolicitarValeForm';

interface PersonaRaw {
  nombre: string | null;
  apellidoPaterno: string | null;
}

interface ClienteRaw {
  id: number;
  estado: string | null;
  persona: PersonaRaw;
}

export default async function SolicitarValePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { ok, data } = await backendGet<ClienteRaw>(`/api/distribuidoras/obtener/cliente/${id}`);

  if (!ok || !data) {
    notFound();
  }

  const nombre = [data.persona?.nombre, data.persona?.apellidoPaterno].filter(Boolean).join(' ') || 'Sin nombre';

  return (
    <>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Solicitar vale para</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{nombre}</div>
      </div>

      <SolicitarValeForm clienteId={data.id} />
    </>
  );
}
