"use client";

import Image from "next/image";

import { avenir_black, avenir_medium } from "@/config/fonts";

interface Props {
  id: string;
}

export const ProductFormat = ({ id }: Props) => {
  return (
    <section
      id={id}
      className="relative w-full p-4 bg-[url('/imgs/bg-product-section.webp')] bg-cover bg-center md:h-[928px] h-auto md:px-20 px-10"
    >
      <Image
        src="/imgs/bandera1.webp"
        alt="Bandera Tradiciones"
        className="absolute top-0 md:left-20 left-10"
        width={50}
        height={50}
      />

      <div className="relative flex flex-col justify-center items-center md:mx-10 md:mt-24 mt-28">
        <span
          className={`${avenir_medium.className} md:text-[56px] text-[32px] text-black justify-center whitespace-nowrap`}
        >
          Elige cuantas necesitas
        </span>
        <span
          className={`${avenir_black.className} md:text-[56px] text-[32px] text-orange-650 justify-center absolute md:top-16 top-12`}
        >
          para tu tradición
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1fr] md:mt-28 mt-16">
        <div className="flex justify-center items-center">
          <Image
            width={630}
            height={490}
            src="/imgs/longa-900.webp"
            alt="Longaniza Premium 900 Grs"
            className="w-[630px] h-auto"
          />
        </div>

        <div className="flex justify-center items-center ">
          <Image
            width={440}
            height={490}
            src="/imgs/longa-450.webp"
            alt="Longaniza Premium 450 Grs"
            className="w-[440px] h-auto"
          />
        </div>

        <div className="flex justify-center items-center">
          <Image
            width={278}
            height={490}
            src="/imgs/longa-250.webp"
            alt="Longaniza Premium 250 Grs"
            className="w-[278px] h-auto"
          />
        </div>
      </div>

      <div className="w-full flex justify-center items-center md:mb-0 mb-20">
        <Image
          width={638}
          height={114}
          src="/imgs/text-product-section.webp"
          alt="Tradiciones Texto"
          className="absolute bottom-10 md:px-0 px-10"
        />
      </div>
    </section>
  );
};
