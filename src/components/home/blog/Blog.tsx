"use client";

import Image from "next/image";

import { avenir_black, avenir_book } from "@/config/fonts";
import { useRouter } from "next/navigation";

const articulos = [
  {
    id: 1,
    title: `LLEGAMOS AL CORAZÓN DEL MERCADO DE CHILLÁN.`,
    description: `Muy pronto abriremos nuestro
nuevo local en el #42, justo al lado
del emblemático teléfono público
En el histórico Mercado de Chillán,
donde confluyen sabores, oficios y
tradiciones del sur de Chile,
donde vive la tradición y el buen
gusto, ahora también estarán las
auténticas longanizas de
Tradiciones de Chillán.
¡Ven por el verdadero sabor de las
longanizas de Chillán!`,
    img: "/imgs/img-blog-1.webp",
    url: "https://www.tradiciones.cl",
  },
  {
    id: 2,
    title: `EL ORIGEN DE LA LONGANIZA: UN VIAJE DESDE ESPAÑA AL MUNDO.`,
    description: `La longaniza es un embutido largo
originario de España, elaborado
con carne de cerdo picada y
especias. Su historia se remonta a la
época romana, donde se
preparaban embutidos similares.
Con el tiempo, la longaniza se
difundió a diversos países,
adaptándose a las tradiciones y
gustos locales, convirtiéndose en
un símbolo gastronómico en
lugares como Chile, Argentina y
Filipinas.`,
    img: "/imgs/img-blog-2.webp",
    url: "https://www.tradiciones.cl",
  },
  {
    id: 3,
    title: `LA LONGANIZA DE CHILLÁN:
ORGULLO Y TRADICIÓN
CHILENA.`,
    description: `La ciudad de Chillán, en la Región
de Ñuble, es reconocida por su
longaniza, un embutido que ha
trascendido fronteras y se ha
convertido en un ícono
gastronómico de Chile. En 2023, la
longaniza de Chillán obtuvo la
Denominación de Origen por parte
del Instituto Nacional de Propiedad
Industrial (Inapi), destacando su
calidad y vínculo con la región.`,
    img: "/imgs/img-blog-3.webp",
    url: "https://www.tradiciones.cl",
  },
];

interface Props {
  id: string;
}

export const Blog = ({ id }: Props) => {
  const router = useRouter();

  const handleClick = (url: string) => {
    router.replace(url);
  };
  return (
    <section
      id={id}
      className="relative w-full flex flex-col gap-4 md:h-[956px] h-auto bg-black justify-center items-center"
    >
      <Image
        width={242}
        height={349}
        src="/imgs/bandera4.webp"
        alt="Bandera Tradiciones"
        className="absolute lg:top-72 md:left-0 left-10 top-0"
      />

      <div className="flex md:flex-row flex-col w-full lg:pl-80 lg:pr-20 lg:items-end items-center gap-4 lg:mb-10 md:mt-0 mt-96">
        {articulos.map((articulo, i) => (
          <div
            key={`${articulo.title} - ${i}`}
            className="flex flex-col h-[700px] w-[400px] xl:gap-4 lg:gap-1 p-4"
          >
            <Image
              height={162}
              width={400}
              src={articulo.img}
              alt={articulo.title}
              className="h-[162px]"
            />

            <div
              className={`min-h-[104px] flex items-center px-9 ${
                i + 1 === 1
                  ? "bg-yellow-650"
                  : i + 1 === 2
                  ? "bg-green-650"
                  : "bg-orange-650"
              }`}
            >
              <span
                className={`${avenir_black.className} text-[16px] text-white uppercase hidden xl:block`}
              >
                {(() => {
                  const words = articulo.title.split(" ");
                  return words.length > 14
                    ? words.slice(0, 14).join(" ") + "..."
                    : articulo.title;
                })()}
              </span>
              <span
                className={`${avenir_black.className} xl:text-[16px] lg:text-[12px] text-white uppercase lg:block xl:hidden`}
              >
                {(() => {
                  const words = articulo.title.split(" ");
                  return words.length > 7
                    ? words.slice(0, 7).join(" ") + "..."
                    : articulo.title;
                })()}
              </span>
            </div>

            <span
              className={`${avenir_book.className} text-xl text-white text-justify pt-8 hidden xl:block`}
            >
              {(() => {
                const words = articulo.description.split(" ");
                return words.length > 50
                  ? words.slice(0, 50).join(" ") + "..."
                  : articulo.description;
              })()}
            </span>
            <span
              className={`${avenir_book.className} text-xl text-white text-justify pt-8 md:hidden block`}
            >
              {(() => {
                const words = articulo.description.split(" ");
                return words.length > 40
                  ? words.slice(0, 40).join(" ") + "..."
                  : articulo.description;
              })()}
            </span>
            <span
              className={`${avenir_book.className} text-xl text-white text-justify pt-8 lg:block hidden xl:hidden`}
            >
              {(() => {
                const words = articulo.description.split(" ");
                return words.length > 25
                  ? words.slice(0, 25).join(" ") + "..."
                  : articulo.description;
              })()}
            </span>

            {/* <button
              onClick={() => handleClick(articulo.url)}
              className={`${
                avenir_book.className
              } w-24 min-h-10 text-white md:mt-0 my-5 ${
                i + 1 === 1
                  ? "bg-yellow-650"
                  : i + 1 === 2
                  ? "bg-green-650"
                  : "bg-orange-650"
              }`}
            >
              Leer Más
            </button> */}
          </div>
        ))}
      </div>
    </section>
  );
};
