// En tu archivo de Server Actions (ej: src/actions/branches/branch-actions.ts)
'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Interfaz para los detalles de la sucursal que se DEVUELVEN
interface BranchDetailsReturned {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  userId: string | null; // <-- CLAVE: Debe ser string | null, no opcional con '?' si siempre se devuelve
  createdAt: Date;
  updatedAt: Date;
  // Asegúrate de que esta interfaz coincida con los campos que seleccionas de Prisma
}

// Tipos de resultado de la Server Action
export type UpsertBranchSuccess = {
  ok: true;
  branch: BranchDetailsReturned; // Usamos la interfaz corregida
  message: string;
};

export type UpsertBranchError = {
  ok: false;
  message: string;
  code?: string;
  errors?: z.ZodIssue[];
};

export type UpsertBranchResult = UpsertBranchSuccess | UpsertBranchError;

const BranchActionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  address: z.string().min(5, { message: 'La dirección debe tener al menos 5 caracteres.' }),
  phone: z.string().min(7, { message: 'El teléfono debe ser válido.' }),
  email: z.string().email({ message: 'Formato de email inválido.' }),
  lat: z.number({ required_error: "Latitud es requerida.", invalid_type_error: "Latitud debe ser un número." }).min(-90).max(90),
  lng: z.number({ required_error: "Longitud es requerida.", invalid_type_error: "Longitud debe ser un número." }).min(-180).max(180),
  userId: z.string().uuid({ message: "ID de usuario inválido"}).nullable().optional(), // Zod permite null o undefined para la entrada
});

export type BranchDataForAction = z.infer<typeof BranchActionSchema>;


export const upsertBranch = async (data: BranchDataForAction): Promise<UpsertBranchResult> => {
  const validationResult = BranchActionSchema.safeParse(data);


  if (!validationResult.success) {
    return {
      ok: false,
      message: "Datos de entrada inválidos.",
      errors: validationResult.error.errors,
    };
  }

  const { id, ...branchInputData } = validationResult.data;

  const dataForPrisma = {
    ...branchInputData,
    userId: branchInputData.userId === undefined ? null : branchInputData.userId,
  };

  try {
    let savedBranch;

    if (id) {
      savedBranch = await prisma.branch.update({
        where: { id },
        data: dataForPrisma,
      });
    } else {
      savedBranch = await prisma.branch.create({
        data: dataForPrisma,
      });
    }

    return {
      ok: true,
      branch: savedBranch as BranchDetailsReturned, 
      message: id ? "Sucursal actualizada con éxito." : "Sucursal creada con éxito.",
    };

  } catch (error: any) {
    console.error("Error en Server Action upsertBranch:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const conflictingFields = error.meta?.target as string[] | undefined;
        const message = `Ya existe una sucursal con estos datos: ${conflictingFields?.join(', ') || 'campo único'}. Por favor, verifica.`;
        return { ok: false, message, code: 'P2002' };
      }
      return { ok: false, message: `Error de base de datos: (Código: ${error.code})`, code: error.code };
    }
    return { ok: false, message: "Ocurrió un error inesperado en el servidor." };
  }
};

export async function getBranchById(id: string) {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    return branch;
  } catch (error) {
    console.error("Failed to fetch branch:", error);
    return null;
  }
}
