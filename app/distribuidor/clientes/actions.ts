'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { backendPost } from '@/lib/backend';

export interface ClienteFormState {
  error: string | null;
}

export async function crearClienteAction(
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
  const { userId } = await getSession();

  const nombre = formData.get('nombre')?.toString().trim();
  const estado = formData.get('estado')?.toString().trim();
  const municipio = formData.get('municipio')?.toString().trim();
  const codigo_postal = formData.get('codigo_postal')?.toString().trim();
  const colonia = formData.get('colonia')?.toString().trim();
  const calle = formData.get('calle')?.toString().trim();
  const numero_exterior = formData.get('numero_exterior')?.toString().trim();

  if (!nombre || !estado || !municipio || !codigo_postal || !colonia || !calle || !numero_exterior) {
    return { error: 'Completa todos los campos obligatorios.' };
  }

  const { ok, message } = await backendPost('/api/distribuidoras/crear/cliente', {
    usuario_id: userId,
    nombre,
    apellido_paterno: formData.get('apellido_paterno')?.toString().trim() || null,
    apellido_materno: formData.get('apellido_materno')?.toString().trim() || null,
    telefono: formData.get('telefono')?.toString().trim() || null,
    genero: formData.get('genero')?.toString().trim() || null,
    estado,
    municipio,
    codigo_postal,
    colonia,
    calle,
    numero_exterior,
    numero_interior: formData.get('numero_interior')?.toString().trim() || null,
    referencia: formData.get('referencia')?.toString().trim() || null,
  });

  if (!ok) {
    return { error: message ?? 'No se pudo crear el cliente. Intenta de nuevo.' };
  }

  revalidatePath('/distribuidor/clientes');
  redirect('/distribuidor/clientes');
}

export async function actualizarClienteAction(
  clienteId: number,
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
  const { userId } = await getSession();

  const nombre = formData.get('nombre')?.toString().trim();
  const estado_cliente = formData.get('estado_cliente')?.toString().trim();

  if (!nombre || !estado_cliente) {
    return { error: 'Completa todos los campos obligatorios.' };
  }

  const { ok, message } = await backendPost('/api/distribuidoras/actualizar/cliente', {
    usuario_id: userId,
    cliente_id: clienteId,
    nombre,
    apellido_paterno: formData.get('apellido_paterno')?.toString().trim() || null,
    apellido_materno: formData.get('apellido_materno')?.toString().trim() || null,
    telefono: formData.get('telefono')?.toString().trim() || null,
    genero: formData.get('genero')?.toString().trim() || null,
    estado_cliente,
    observaciones: formData.get('observaciones')?.toString().trim() || null,
  });

  if (!ok) {
    return { error: message ?? 'No se pudo actualizar el cliente.' };
  }

  revalidatePath('/distribuidor/clientes');
  revalidatePath(`/distribuidor/clientes/${clienteId}`);
  redirect(`/distribuidor/clientes/${clienteId}`);
}

export async function eliminarClienteAction(clienteId: number) {
  const { userId } = await getSession();

  await backendPost('/api/distribuidoras/eliminar/cliente', {
    usuario_id: userId,
    cliente_id: clienteId,
  });

  revalidatePath('/distribuidor/clientes');
  redirect('/distribuidor/clientes');
}
