"use client";

import { avenir_book } from "@/config/fonts";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col w-full justify-center text-xs md:h-[200px] h-auto md:py-0 py-10 md:px-0 px-5 bg-orange-650 md:gap-0 gap-14">
      <div className="flex-1 h-full flex flex-col items-center justify-center gap-4">
        <span
          className={`${avenir_book.className} text-[18px] text-white md:mr-20`}
        >
          Siguenos:{" "}
        </span>
        <div className="flex gap-6">
          {/* <Image
            width={40}
            height={40}
            src="/imgs/icon-yt-white.webp"
            alt="Youtube"
            className="w-10 h-10"
          /> */}
          <Image
            width={40}
            height={40}
            src="/imgs/icon-instagram-white.webp"
            alt="Instagram"
            className="w-10 h-10"
            onClick={() =>
              window.open(
                "https://www.instagram.com/tradicionesdechillan",
                "_blank"
              )
            }
          />
          {/* <Image
            width={40}
            height={40}
            src="/imgs/icon-tiktok.webp"
            alt="TikTok"
            className="w-10 h-10"
          /> */}
        </div>
      </div>

      <div className="lg:flex justify-center items-center hidden ">
        <div className="w-px h-[100px] bg-white" />
      </div>

      <div className="flex-1 h-full flex flex-col items-center justify-center gap-4">
        <span
          className={`${avenir_book.className} text-[18px] text-white md:mr-60 lg:mr-0`}
        >
          Contáctanos:{" "}
        </span>
        <div className="flex gap-4 justify-center items-center xl:ml-0 lg:ml-10 ml-8 text-nowrap">
          <Image
            width={40}
            height={40}
            src="/imgs/whatsapp-icon.webp"
            alt="Whatsapp"
            className="w-10 h-10"
          />
          <Link
            href="https://wa.me/56935683255"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className={`${avenir_book.className} lg:text-[30px] md:text-[36px] text-[30px] text-white mr-20`}
            >
              +56 935 683 255
            </span>
          </Link>
        </div>
      </div>

      <div className="lg:flex justify-center items-center hidden">
        <div className="w-px h-[100px] bg-white" />
      </div>

      <div className="flex-1 h-full flex flex-col items-center justify-center gap-4">
        <span
          className={`${avenir_book.className} text-[18px] text-white xl:mr-20`}
        >
          Suscribete a nuestro Newsletter
        </span>
        <div className="flex justify-center items-center md:px-0">
          <input
            type="text"
            placeholder="Email"
            className={`${avenir_book.className} text-[18px] xl:w-[290px] w-[150px] h-[50px] pl-4 focus:outline-none`}
          />
          <button
            className={`${avenir_book.className} xl:text-[15px] lg:text-[12px] bg-black xl:w-[135px] lg:w-[100px] h-[51px] text-white px-4`}
          >
            SUSCRIBIRME
          </button>
        </div>
      </div>
    </div>
  );
};
