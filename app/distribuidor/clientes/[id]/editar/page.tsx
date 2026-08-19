import { notFound } from 'next/navigation';
import { getSession } from '@/lib/session';
import { backendPost } from '@/lib/backend';
import EditarClienteForm from './EditarClienteForm';

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

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await getSession();

  const { ok, data } = await backendPost<ClienteDetalle>('/api/distribuidoras/consultar/cliente', {
    usuario_id: userId,
    cliente_id: Number(id),
  });

  if (!ok || !data) {
    notFound();
  }

  return <EditarClienteForm cliente={data} />;
}
