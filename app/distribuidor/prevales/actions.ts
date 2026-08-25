'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { backendPost } from '@/lib/backend';

export interface PrevaleFormState {
  error: string | null;
}

export async function crearPrevaleAction(
  clienteId: number,
  _prevState: PrevaleFormState,
  formData: FormData
): Promise<PrevaleFormState> {
  const tipo_vale = formData.get('tipo_vale')?.toString();
  const cantidad_solicitada = formData.get('cantidad_solicitada')?.toString();
  const plazos = formData.get('plazos')?.toString();

  if (!tipo_vale || !cantidad_solicitada || !plazos) {
    return { error: 'Completa todos los campos.' };
  }

  const { ok, message, data } = await backendPost<{ id: number }>('/api/vales/prevales/crear', {
    cliente_id: clienteId,
    tipo_vale,
    cantidad_solicitada: Number(cantidad_solicitada),
    plazos: Number(plazos),
  });

  if (!ok || !data) {
    return { error: message ?? 'No se pudo crear la solicitud. Intenta de nuevo.' };
  }

  revalidatePath('/distribuidor/estado-cuenta');
  redirect(`/distribuidor/estado-cuenta/prevales/${data.id}`);
}
