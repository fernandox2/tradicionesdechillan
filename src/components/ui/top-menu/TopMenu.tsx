"use client";

import {
  sequel,
} from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

interface MenuItem {
  id: number;
  name: string;
  url: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Home",
    url: "/",
  },
  {
    id: 2,
    name: "Nosotros",
    url: "/about",
  },
  {
    id: 3,
    name: "Productos",
    url: "/products",
  },
  {
    id: 4,
    name: "Distribuidores",
    url: "/distributors",
  },
  {
    id: 5,
    name: "Blog",
    url: "/blog",
  },
  {
    id: 6,
    name: "Contacto",
    url: "/contact",
  },
];

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const TopMenu = (items: MenuItem[]) => {
    return (
      <>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.url}
            className="group m-2 p-2 rounded-md transition-all"
          >
            <span className="relative text-2xl">
              {item.name}
              <span className="absolute left-0 -bottom-2 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        ))}
      </>
    );
  };

  return (
    <nav className="flex flex-col-reverse px-5 justify-center items-center w-full bg-[url('/imgs/background_top_menu.webp')] bg-cover bg-center h-[100px] md:h-[257px] bg-no-repeat">
      {/* Center Menu */}
      <div className={`${sequel.className} hidden md:block text-white py-10`}>
        <div className="flex justify-center items-center">
          {TopMenu(menuItems)}
          <img src="/imgs/siguenos.webp" alt="Logo" className="w-1/2 mx-auto" />
        </div>
        
      </div>

      {/* Search, Cart & Menu */}
      <div className="flex w-full justify-end items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-8 h-8 text-white" />
        </Link>
        {loaded && (
          <Link
            href={totalItemsInCart > 0 ? "/cart" : "/empty"}
            className="mx-2"
          >
            <div className="relative">
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2">
                  {totalItemsInCart}
                </span>
              )}
              <IoCartOutline className="w-8 h-8 text-white" />
            </div>
          </Link>
        )}

        <button
          className={`${sequel.className} m-2 p-2 rounded-md transition-all hover:bg-gray-200 md:hidden text-white`}
          onClick={openSideMenu}
        >
          Menu
        </button>
      </div>
    </nav>
  );
};
