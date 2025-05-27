"use server";

import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { Role } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

interface PaginationOptions {
  page?: number;
  take?: number;
  query?: string;
}

export type UserForForm = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image: string | null;
};

export interface UserFormState {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    role?: string[];
    image?: string[];
    _form?: string[];
  };
  success?: boolean;
  isEdit?: boolean;
  userId?: string;
}

const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "El nombre es requerido." }).max(100),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().optional(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Por favor, selecciona un rol válido." }),
  }),
  image: z
    .string()
    .url({ message: "Por favor, introduce una URL válida para la imagen." })
    .or(z.literal(""))
    .optional(), // Optional URL
});

export async function getUserById(id: string): Promise<UserForForm | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function upsertUserAction(
  prevState: UserFormState | undefined,
  formData: FormData
): Promise<UserFormState> {
  const rawFormData = Object.fromEntries(formData.entries());
  const isEdit = !!rawFormData.id;

  const schemaWithConditionalPassword = UserSchema.superRefine((data, ctx) => {
    if (!data.id && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message:
          "La contraseña es requerida y debe tener al menos 6 caracteres para nuevos usuarios.",
      });
    }
    if (
      data.id &&
      data.password &&
      data.password.length > 0 &&
      data.password.length < 6
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message:
          "Si actualiza la contraseña, debe tener al menos 6 caracteres.",
      });
    }
  });

  const validatedFields = schemaWithConditionalPassword.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, revisa los campos.",
      success: false,
      isEdit,
    };
  }

  const { id, name, email, role, image } = validatedFields.data;
  let { password } = validatedFields.data;

  try {
    if (isEdit && id) {
      let dataToUpdate: any = { name, email, role, image: image || null };
      if (password && password.trim() !== "") {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/edit/${id}`);
      return {
        message: "Usuario actualizado exitosamente.",
        success: true,
        isEdit: true,
        userId: updatedUser.id,
      };
    } else {
      if (!password) {
        return {
          errors: { password: ["La contraseña es requerida."] },
          message: "Error",
          success: false,
          isEdit: false,
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
          image: image || null,
        },
      });
      revalidatePath("/admin/users");
      return {
        message: "Usuario creado exitosamente.",
        success: true,
        isEdit: false,
        userId: newUser.id,
      };
    }
  } catch (error: any) {
    console.error("Database Error:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return {
        errors: { email: ["Este email ya está en uso."] },
        message: "Error al guardar.",
        success: false,
        isEdit,
      };
    }
    return {
      errors: { _form: ["Algo salió mal. No se pudo guardar el usuario."] },
      message: "Error al guardar.",
      success: false,
      isEdit,
    };
  }
}

export const getAllUsers = async ({
  page = 1,
  take = 12,
  query,
}: PaginationOptions) => {
  try {
    let currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

    let currentTake = Number(take);
    if (isNaN(currentTake) || currentTake < 1) {
      currentTake = 12;
    }

    const whereClause: Prisma.UserWhereInput = {};
    const trimmedQuery = query?.trim();

    if (trimmedQuery && trimmedQuery !== "") {
      whereClause.OR = [
        {
          name: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
      ];
    } else {
      console.log(
        "[getAllUsers Action] No query or empty query, not applying text filter."
      );
    }

    const [users, totalUsers] = await prisma.$transaction([
      prisma.user.findMany({
        take: currentTake,
        skip: (currentPage - 1) * currentTake,
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          image: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / currentTake);

    return {
      ok: true,
      users,
      currentPage: currentPage,
      totalUsers: totalUsers,
      totalPages,
    };
  } catch (error) {
    console.error("[getAllUsers Action] Error:", error);
    return {
      ok: false,
      users: [],
      currentPage: Number(page) || 1,
      totalUsers: 0,
      totalPages: 0,
      error: "No se pudo obtener la lista de usuarios.",
    };
  }
  
};


export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
};
