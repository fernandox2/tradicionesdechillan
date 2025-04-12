"use server";

import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password: bcryptjs.hashSync(password, 10),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return {
      ok: true,
      user,
      message: "Usuario creado correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      user: null,
      message: "Error al crear el usuario",
    }
  }
};
