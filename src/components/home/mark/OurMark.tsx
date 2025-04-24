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
      className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 bg-black xl:h-[956px] lg:h-auto"
    >
      {/* Primera columna */}
      <div className="flex flex-col items-center py-10">
        <div className="flex items-center lg:mr-40 mr-20">
          {/* Logo */}
          <Image
            src="/imgs/icono-tradiciones.webp"
            alt="Logo"
            className="px-5 mb-5"
            width={130}
            height={130}
          />
          {/* Titulo */}
          <div className="relative py-20">
            <span
              className={`${sequel.className} lg:text-5xl text-4xl text-white absolute top-12 lg:pl-[7.5rem] pl-20`}
            >
              Nuestra
            </span>
            <span
              className={`${nickainley.className} text-white lg:text-8xl text-7xl`}
            >
              Marca{" "}
            </span>
          </div>
        </div>
        {/* Texto */}
        <div
          className={`${avenir_book.className} text-white text-[20px] text-justify px-10 md:px-24 mb-20`}
        >
          <span>
            En <span className="font-bold">Tradiciones de Chillán</span>, no
            solo hacemos longanizas: creamos momentos que unen generaciones.
            Somos la excusa perfecta, somo una parte importante cuando decimos{" "}
            <span className="font-bold">“Lo rico de juntarnos”.</span>{" "}
          </span>
          <br />
          <br />
          <span>
            Nuestra receta tradicional, nacida en el corazón de Chillán, ha sido
            parte de mesas, historias y celebraciones por décadas. Porque
            sabemos que el sabor también es un lenguaje, y el nuestro habla de
            familia, de encuentros y de orgullo por lo que somos.{" "}
          </span>
          <br />
          <br />
          <span>
            Tradiciones de Chillán es el sabor que nos conecta con lo auténtico,
            combinando tradición y tecnología para llevarte un embutido único,
            lleno de historia y calidad.{" "}
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
      {/* Segunda columna */}
      <div className="flex flex-col-reverse px-5 justify-center items-center w-full bg-[url('/imgs/img-nuestra-marca.webp')] bg-cover bg-center lg:h-full h-[700px]"></div>
    </section>
  );
};
