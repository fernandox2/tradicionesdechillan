"use client";

import Image from "next/image";
import { avenir_book, nickainley, sequel } from "@/config/fonts";

interface Props {
  id: string;
}

export const OurMark = ({ id }: Props) => {
  return (
    <section
      id={id}
      className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[700px] lg:min-h-[956px] bg-black"
    >
      <div className="flex flex-col items-center py-10">
        <div className="flex items-center mr-20 lg:mr-40">
          <Image
            src="/imgs/icono-tradiciones.webp"
            alt="Logo"
            className="px-5 mb-5"
            width={130}
            height={130}
            priority
          />
          <div className="relative py-20">
            <span
              className={`${sequel.className} text-4xl lg:text-5xl text-white absolute top-12 pl-20 lg:pl-[7.5rem]`}
            >
              Nuestra
            </span>
            <span
              className={`${nickainley.className} text-white text-7xl lg:text-8xl`}
            >
              Marca
            </span>
          </div>
        </div>
        <div
          className={`${avenir_book.className} text-white text-[20px] text-justify px-10 md:px-24 mb-20`}
        >
          <span>
            En <span className="font-bold">Tradiciones de Chillán</span>, no solo
            hacemos longanizas: creamos momentos que unen generaciones. Somos la
            excusa perfecta, somo una parte importante cuando decimos{" "}
            <span className="font-bold">“Lo rico de juntarnos”.</span>
          </span>
          <br />
          <br />
          <span>
            Nuestra receta tradicional, nacida en el corazón de Chillán, ha sido
            parte de mesas, historias y celebraciones por décadas. Porque sabemos
            que el sabor también es un lenguaje, y el nuestro habla de familia, de
            encuentros y de orgullo por lo que somos.
          </span>
          <br />
          <br />
          <span>
            Tradiciones de Chillán es el sabor que nos conecta con lo auténtico,
            combinando tradición y tecnología para llevarte un embutido único,
            lleno de historia y calidad.
          </span>
          <br />
          <br />
          <span>
            Un sabor reconocido en todos los rincones de Chile, que despierta
            recuerdos, une generaciones y transforma cada comida en un momento
            para recordar
          </span>
        </div>
      </div>

      <div className="relative w-full h-[700px] lg:h-full">
        <Image
          src="/imgs/img-nuestra-marca.webp"
          alt="Nuestra Marca"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
};
