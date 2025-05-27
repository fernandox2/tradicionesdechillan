'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type DeleteBranchResult = {
  ok: boolean;
  message?: string;
  error?: string;
};

export const deleteBranchAction = async (branchId: string): Promise<DeleteBranchResult> => {
  if (!branchId) {
    return { ok: false, error: "Se requiere el ID de la sucursal para eliminarla." };
  }

  try {
    await prisma.branch.delete({
      where: { id: branchId },
    });

    console.log(`Sucursal con ID: ${branchId} eliminada exitosamente.`);

    revalidatePath('/admin/branches');
    return { ok: true, message: "Sucursal eliminada exitosamente." };

  } catch (error: any) {
    console.error(`Error al eliminar la sucursal con ID ${branchId}:`, error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return { ok: false, error: "No se encontró la sucursal para eliminar. Es posible que ya haya sido eliminada." };
      }
      return { ok: false, error: `Error de base de datos al eliminar la sucursal (Código: ${error.code}).` };
    }

    return {
      ok: false,
      error: "Ocurrió un error inesperado al intentar eliminar la sucursal.",
    };
  }
};