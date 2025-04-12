"use server";

import { signIn } from "@/auth.config";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const data = Object.fromEntries(formData);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return "Success";
  } catch (error) {
    return "Invalid credentials.";
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn("credentials", { email, password, redirect: false });
    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al iniciar sesión",
    };
  }
};
