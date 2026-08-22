import { notFound } from 'next/navigation';
import { backendGet } from '@/lib/backend';
import EditarClienteForm from './EditarClienteForm';

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

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { ok, data } = await backendGet<ClienteRaw>(`/api/distribuidoras/obtener/cliente/${id}`);

  if (!ok || !data) {
    notFound();
  }

  return <EditarClienteForm cliente={data} />;
}