"use client";

import Image from "next/image";

import { avenir_book, nickainley, sequel } from "@/config/fonts";

export const ProductPremium = () => {
  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-4 h-auto xl:h-[956px] lg:h-auto bg-orange-650">
      {/* Primera columna */}
      <div className="flex flex-col-reverse px-5 justify-center items-center w-full bg-[url('/imgs/img-premium-section.webp')] bg-cover bg-center md:h-full h-[700px]"></div>

      {/* Segunda columna */}
      <div className={`flex flex-col items-center`}>
        <div className="flex items-center lg:mr-20 mr-10 md:mt-[100px] mt-10">
          {/* Logo */}
          <Image
            src="/imgs/icon-2.webp"
            alt="Logo"
            className="px-5 mb-24"
            width={130}
            height={130}
          />
          {/* Titulo */}
          <div className="relative py-20">
            <span
              className={`${sequel.className} lg:text-5xl text-4xl text-white absolute top-0 mt-8`}
            >
              Longanizas
            </span>
            <span
              className={`${nickainley.className} text-white text-6xl lg:ml-[142px] ml-10`}
            >
              Premium
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
    </div>
  );
};
