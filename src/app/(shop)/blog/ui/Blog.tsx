"use client";

import Image from "next/image";
import truncate from "html-truncate";
import { Article } from "@/interfaces";

interface Props {
  articles: Article[];
  className?: string;
}

export const Blog = ({ articles, className }: Props) => {
  return (
    <div className={`${className}`}>
      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
        >
          <Image
            src={article.image}
            alt={article.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />

          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {article.createdAt
                ? new Date(article.createdAt).toLocaleDateString("es-ES")
                : "Fecha desconocida"}{" "}
              - {article.author?.name || "Autor Desconocido"}
            </p>

            <div
              className="text-gray-700 line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: truncate(article.content!, 300),
              }}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {article.category.map((category) => (
                <span
                  key={category}
                  className="bg-green-650 text-white text-xs font-medium px-2 py-1 rounded"
                >
                  {category}
                </span>
              ))}
            </div>

            <button
              onClick={() => (window.location.href = `/blog/${article.slug}`)}
              className="mt-4 w-full bg-orange-650 text-white py-2 px-4 rounded hover:bg-yellow-650 transition"
            >
              Leer más
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
