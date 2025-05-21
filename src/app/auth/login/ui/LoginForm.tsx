"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUIStore } from "@/store";
import { avenir_book } from "@/config/fonts";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const closeMenu = useUIStore((state) => state.closeSidemenu);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      closeMenu();
      router.refresh(); // ✅ fuerza revalidación del estado de sesión
      router.replace("/");
    } else {
      setError("Credenciales inválidas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3">
      <div className={`${avenir_book.className} flex flex-col text-xl`}>
        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
        />

        <button type="submit" className="btn-primary">
          Ingresar
        </button>

        {error && (
          <div className="text-sm text-red-500 mt-2">{error}</div>
        )}

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link href="/auth/new-account" className="btn-secondary text-center">
          Crear una nueva cuenta
        </Link>
      </div>
    </form>
  );
};
