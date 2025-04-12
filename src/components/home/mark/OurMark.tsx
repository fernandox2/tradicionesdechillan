'use client';

import { avenir_book, nickainley, sequel } from "@/config/fonts";

export const OurMark = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[928px] bg-black">
      {/* Primera columna */}
      <div className={`flex flex-col items-center py-10`}>
        <div className="flex items-center mr-40">
          {/* Logo */}
          <img
            src="/imgs/icono-tradiciones.webp"
            alt="Logo"
            className="px-5 mb-5"
            width={130}
          />
          {/* Titulo */}
          <div className="relative py-20">
            <span
              className={`${sequel.className} text-5xl text-white absolute top-12 pl-[7.5rem]`}
            >
              Nuestra
            </span>
            <span className={`${nickainley.className} text-white text-8xl`}>
              Marca{" "}
            </span>
          </div>
        </div>
        {/* Texto */}
        <span
          className={`${avenir_book.className} text-white text-[20px] text-justify px-10 md:px-24`}
        >
          En <span className="font-bold">Tradiciones de Chillán</span>, no solo
          hacemos longanizas: creamos momentos que unen generaciones. Somos la
          excusa perfecta, somo una parte importante cuando decimos{" "}
          <span className="font-bold">“Lo rico de juntarnos”.</span>{" "}
        </span>
        <br />
        <span
          className={`${avenir_book.className} text-white text-[20px] text-justify px-10 md:px-24`}
        >
          Nuestra receta tradicional, nacida en el corazón de Chillán, ha sido
          parte de mesas, historias y celebraciones por décadas. Porque sabemos
          que el sabor también es un lenguaje, y el nuestro habla de familia, de
          encuentros y de orgullo por lo que somos.{" "}
        </span>
        <br />
        <span
          className={`${avenir_book.className} text-white text-[20px] text-justify px-10 md:px-24`}
        >
          Tradiciones de Chillán es el sabor que nos conecta con lo auténtico,
          combinando tradición y tecnología para llevarte un embutido único,
          lleno de historia y calidad.{" "}
        </span>

        <br />
        <span
          className={`${avenir_book.className} text-white text-[20px] text-justify px-10 md:px-24`}
        >
          Un sabor reconocido en todos los rincones de Chile, que despierta
          recuerdos, une generaciones y transforma cada comida en un momento
          para recordar
        </span>
      </div>
      {/* Segunda columna */}
      <div className="flex flex-col-reverse px-5 justify-center items-center w-full bg-[url('/imgs/img-nuestra-marca.webp')] bg-cover bg-center"></div>
    </div>
  );
};
