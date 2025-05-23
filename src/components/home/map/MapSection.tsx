"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { avenir_light, avenir_medium, sequel } from "@/config/fonts";
import { Branch } from "@/interfaces";
import Link from "next/link";

interface Props {
  branches?: Branch[];
  mapboxToken?: string;
  id: string;
}

export const MapSection = ({ branches, mapboxToken, id }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [MapboxLocales, setMapboxLocales] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          import("./MapboxLocales").then((mod) =>
            setMapboxLocales(() => mod.default)
          );
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      className="relative w-full xl:h-[928px] lg:h-auto flex flex-col items-center"
    >
      <Image
        width={242}
        height={349}
        src="/imgs/bandera2.webp"
        alt="Bandera Tradiciones"
        className="absolute top-0 lg:left-20 left-10"
      />

      <div className="w-full flex flex-col justify-center items-center md:mt-24 mt-96 px-10">
        <span
          className={`${sequel.className} text-[35px] xl:ml-0 lg:ml-60 md:ml-40`}
        >
          Una Tradicion que se encuentra
        </span>
        <span
          className={`${sequel.className} text-[35px] text-orange-650 mr-24 md:ml-40 lg:ml-60 xl:ml-0`}
        >
          en lugares muy especiales
        </span>

        <span className="w-full bg-gray-400 h-0.5 md:hidden mt-10" />

        <div className="w-full grid grid-cols-1 md:grid-cols-3 xl:mt-10 lg:mt-36 gap-4 md:pl-72 xl:pl-96 lg:pl-10">
          {branches?.map((local, index) => (
            <div key={index} className="flex flex-col items-start gap-2 mt-10">
              <span
                className={`${avenir_medium.className} text-2xl flex gap-2 text-wrap`}
              >
                <Image
                  width={28}
                  height={28}
                  src="/imgs/icono-tradiciones.webp"
                  className="w-[28px] h-[28px] rounded-full mt-2"
                  alt={local.name}
                />
                {local.name}
              </span>
              <span className={`${avenir_light.className} text-xl flex gap-2`}>
                <Image
                  width={28}
                  height={28}
                  src="/imgs/address-icon.webp"
                  className="w-[28px] h-[28px] rounded-full"
                  alt={local.name}
                />
                {local.address}
              </span>
              <Link
                href={`https://wa.me/${local.phone?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${avenir_light.className} text-xl flex gap-2`}
              >
                <Image
                  width={28}
                  height={28}
                  src="/imgs/whatsapp-icon.webp"
                  className="w-[28px] h-[28px] rounded-full"
                  alt={local.name}
                />
                {local.phone}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full flex justify-center items-center mt-10 min-h-[500px]"
      >
        {MapboxLocales && mapboxToken && branches && (
          <MapboxLocales mapboxToken={mapboxToken} locales={branches} />
        )}
      </div>
    </section>
  );
};
