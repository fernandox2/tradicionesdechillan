"use client";

import { useFormState, useFormStatus } from "react-dom";

import Link from "next/link";

import { authenticate } from "@/actions";
import { IoInformationOutline, IoInformationSharp } from "react-icons/io5";
import clsx from "clsx";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store";

export const LoginForm = () => {
  const [state, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();
  const closeMenu = useUIStore((state) => state.closeSidemenu);

  useEffect(() => {
    if (state === "Success") {
      closeMenu();
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <form action={dispatch} className="space-y-3">
        <div className="flex flex-col">
          <label htmlFor="email">Correo electrónico</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5"
            type="email"
            name="email"
          />

          <label htmlFor="password">Contraseña</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5"
            type="password"
            name="password"
          />

          <LoginButton />

          <div className="flex h-8 items-end space-x-1">
            {state?.toString() === "Invalid credentials." && (
              <>
                <p className="text-sm text-red-500">Credenciales Inválidas</p>
              </>
            )}
          </div>

          {/* divisor l ine */}
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
    </>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx({
        "btn-primary": !pending,
        "btn-disabled": pending,
      })}
    >
      Ingresar
    </button>
  );
}
