"use client";

import React from "react";

import { signOut, useSession } from "next-auth/react";

import Link from "next/link";

import clsx from "clsx";

import { useUIStore } from "@/store";

import {
  IoBookOutline,
  IoCartOutline,
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoMailOutline,
  IoNewspaperOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoStorefrontOutline,
  IoTicketOutline,
} from "react-icons/io5";

import { MdOutlineStorefront } from "react-icons/md";
import { FaBlog } from "react-icons/fa6";

import { avenir_book } from "@/config/fonts";
import Image from "next/image";

export const Sidebar = () => {
  const { data: session, status } = useSession();

  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSidemenu);

  return (
    <div>
      {/* background black */}
      {isSideMenuOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen z-20 bg-black opacity-30"
          onClick={closeMenu}
        />
      )}

      {/* blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* SideMenu */}
      <nav
        className={clsx(
          `${avenir_book.className} fixed p-5 right-0 top-0 w-[400px] h-screen bg-white z-20 shadow-2xl transform transition.all duration-300`,
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={45}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => {
            closeMenu();
          }}
        />

        {/* Input */}
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-3 left-2" />
          <input
            type="text"
            placeholder="Escribe para buscar..."
            className="w-full bg-gray-50 rounded pl-10 py-2 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-orange-650"
          />
        </div>

        {/* Menú */}
        {session && (
          <Link
            href="/profile"
            onClick={closeMenu}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoPersonOutline size={30} />
            <span className="ml-3 text-xl">Perfil</span>
          </Link>
        )}

        {session && (
          <Link
            href="/orders"
            onClick={closeMenu}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Órdenes</span>
          </Link>
        )}

        {!session && (
          <Link
            href="/auth/login"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {!session && (
          <Link
            href="/#nosotros"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all lg:hidden"
            onClick={closeMenu}
          >
            <IoPeopleOutline size={30} />
            <span className="ml-3 text-xl">Nosotros</span>
          </Link>
        )}

        {!session && (
          <Link
            href="/#productos"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all lg:hidden"
            onClick={closeMenu}
          >
            <IoCartOutline size={30} />
            <span className="ml-3 text-xl">Productos</span>
          </Link>
        )}

        {!session && (
          <Link
            href="/#distribuidores"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all lg:hidden"
            onClick={closeMenu}
          >
            <IoStorefrontOutline size={30} />
            <span className="ml-3 text-xl">Distribuidores</span>
          </Link>
        )}

        {!session && (
          <Link
            href="/#blog"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all lg:hidden"
            onClick={closeMenu}
          >
            <IoNewspaperOutline size={30} />
            <span className="ml-3 text-xl">Blog</span>
          </Link>
        )}

        {!session && (
          <Link
            href="/#contacto"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all lg:hidden"
            onClick={closeMenu}
          >
            <IoMailOutline size={30} />
            <span className="ml-3 text-xl">Contacto</span>
          </Link>
        )}

        {session && (
          <button
            className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={async () => {
              await signOut({ redirect: false });
              closeMenu();
            }}
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}

        {/* Linea de Separacion */}
        {session && session.user.role === "admin" && (
          <div className=" w-full h-px  bg-gray-200 my-10" />
        )}
        {session && session.user.role === "admin" && (
          <Link
            href="/admin/products"
            onClick={closeMenu}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <Image src={"/imgs/longa.svg"} alt="Longaniza" width={30} height={30} />
            {/* <IoShirtOutline size={30} /> */}
            <span className="ml-3 text-xl">Productos</span>
          </Link>
        )}

        {session && session.user.role === "admin" && (
          <Link
            href="/orders"
            onClick={closeMenu}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Órdenes</span>
          </Link>
        )}

        {session && session.user.role === "admin" && (
          <Link
            href="/admin/users"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={closeMenu}
          >
            <IoPeopleOutline size={30} />
            <span className="ml-3 text-xl">Usuarios</span>
          </Link>
        )}

        {session && session.user.role === "admin" && (
          <Link
            href="/admin/blog"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={closeMenu}
          >
            <FaBlog size={30} />

            <span className="ml-3 text-xl">Blog</span>
          </Link>
        )}

        {session && session.user.role === "admin" && (
          <Link
            href="/admin/branch"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={closeMenu}
          >
            <MdOutlineStorefront size={30} />

            <span className="ml-3 text-xl">Locales</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
