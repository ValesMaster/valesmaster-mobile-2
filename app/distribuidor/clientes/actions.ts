'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { backendPost, backendPatch } from '@/lib/backend';

export interface ClienteFormState {
  error: string | null;
}

export async function crearClienteAction(
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
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

/**
 * Solo permite modificar datos de persona y dirección
 * (el endpoint real /modificar/cliente/:id no acepta estado ni observaciones del cliente).
 * Los campos de dirección solo se envían si el usuario escribió algo,
 * para no sobreescribir con vacío lo que ya existía.
 */
export async function actualizarClienteAction(
  clienteId: number,
  _prevState: ClienteFormState,
  formData: FormData
): Promise<ClienteFormState> {
  const nombre = formData.get('nombre')?.toString().trim();

  if (!nombre) {
    return { error: 'El nombre es obligatorio.' };
  }

  const body: Record<string, unknown> = { nombre };

  const opcionalesPersona = ['apellido_paterno', 'apellido_materno', 'telefono', 'genero', 'fecha_nacimiento'];
  const opcionalesDireccion = ['estado', 'municipio', 'codigo_postal', 'colonia', 'calle', 'numero_exterior', 'numero_interior', 'referencia'];

  for (const campo of [...opcionalesPersona, ...opcionalesDireccion]) {
    const valor = formData.get(campo)?.toString().trim();
    if (valor) body[campo] = valor;
  }

  const { ok, message } = await backendPatch(`/api/distribuidoras/modificar/cliente/${clienteId}`, body);

  if (!ok) {
    return { error: message ?? 'No se pudo actualizar el cliente.' };
  }

  revalidatePath('/distribuidor/clientes');
  revalidatePath(`/distribuidor/clientes/${clienteId}`);
  redirect(`/distribuidor/clientes/${clienteId}`);
}

export async function eliminarClienteAction(clienteId: number) {
  await backendPatch(`/api/distribuidoras/eliminar/cliente/${clienteId}`);

  revalidatePath('/distribuidor/clientes');
  redirect('/distribuidor/clientes');
}