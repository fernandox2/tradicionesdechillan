"use client";

import Image from "next/image";
import { avenir_black, avenir_book } from "@/config/fonts";
import { useRouter } from "next/navigation";
import { Article } from "@/interfaces";
import truncate from "html-truncate";

interface Props {
  id: string;
  articles: Article[];
}

export const Blog = ({ id, articles }: Props) => {
  const router = useRouter();

  const handleClick = (slug: string) => {
    router.push(`/blog/${slug}`);
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
        className="absolute lg:top-72 left-20 lg:left-0 top-0 md:w-[121px] md:h-[174.5px] lg:w-[242px] lg:h-[349px]"
      />

      <div className="flex md:flex-row flex-col w-full lg:pl-80 lg:pr-20 lg:items-end items-center gap-4 lg:mb-10 md:mt-0 mt-96 md:pt-24 lg:pt-0">
        {articles.map((articulo, i) => (
          <div
            key={`${articulo.title} - ${i}`}
            className="flex flex-col h-[700px] w-[400px] xl:gap-4 lg:gap-1 p-4"
          >
            <Image
              height={162}
              width={400}
              src={articulo.image}
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
                className={`${
                  avenir_black.className
                } text-[16px] uppercase hidden xl:block ${
                  i + 1 === 3 ? "text-white" : "text-black"
                }`}
              >
                {(() => {
                  const words = articulo.title.split(" ");
                  return words.length > 14
                    ? words.slice(0, 14).join(" ") + "..."
                    : articulo.title;
                })()}
              </span>
              <span
                className={`${
                  avenir_black.className
                } xl:text-[16px] lg:text-[12px] uppercase lg:block xl:hidden ${
                  i + 1 === 3 ? "text-white" : "text-black"
                }`}
              >
                {(() => {
                  const words = articulo.title.split(" ");
                  return words.length > 7
                    ? words.slice(0, 7).join(" ") + "..."
                    : articulo.title;
                })()}
              </span>
            </div>

            <div
              className={`${avenir_book.className} text-xl text-white text-justify leading-relaxed pt-8 hidden xl:block`}
              dangerouslySetInnerHTML={{
                __html: truncate(articulo.content, 300),
              }}
            />

            <div
              className={`${avenir_book.className} text-xl text-white text-justify pt-8 md:hidden block`}
              dangerouslySetInnerHTML={{
                __html: truncate(articulo.content, 300),
              }}
            />

            <div
              className={`${avenir_book.className} text-xl text-white text-justify pt-8 md:block hidden xl:hidden`}
              dangerouslySetInnerHTML={{
                __html: truncate(articulo.content, 200),
              }}
            />

            <button
              onClick={() => handleClick(articulo.slug)}
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
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
