"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IoPencil,
  IoDocumentTextOutline,
  IoTrashOutline,
} from "react-icons/io5";
import type { Article } from "@/interfaces";
import { Mensaje } from "@/components/ui/toast/Toast";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/actions/article/delete-article";
import { deleteImageFTP } from "@/actions/article/delete-article-image";

interface IProps {
  articles: Article[];
}

export const ArticlesTable = ({ articles }: IProps) => {
  const router = useRouter();

  function stripHtml(html: string) {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  }

  const extractImageUrlsFromHtml = (content: string): string[] => {
    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    const urls: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  };

  const eliminarImagenesFtp = async (
    articleId: string,
    content: string,
    image: string
  ) => {
    const contentImageUrls = extractImageUrlsFromHtml(content);
    const allImageUrls = [...new Set([...contentImageUrls, image])];

    // Eliminar imágenes del FTP
    for (const imageUrl of allImageUrls) {
      const res = await deleteImageFTP(imageUrl, articleId);
      if (!res.ok) {
        console.warn("Error eliminando imagen:", res.error);
      }
    }
  };

  const handleDeleteArticle = async (
    articleId: string,
    content: string,
    image: string
  ) => {
    if (!articleId) {
      Mensaje("No se encontro el articulo.", "error", {
        title: "Slug duplicado",
      });
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar este artículo?")) return;

    await eliminarImagenesFtp(articleId, content, image);

    await deleteArticle(articleId);

    Mensaje("Artículo eliminado correctamente.", "success", {
      title: "Artículo eliminado",
    });

    router.refresh();
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm text-left text-slate-700">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="w-16 px-4 py-3 md:px-6">Imagen</th>
              <th className="w-32 px-4 py-3 md:px-6">Autor</th>
              <th className="max-w-xs px-4 py-2 text-left truncate">
                Categorías
              </th>
              <th className="min-w-[150px] px-4 py-3 md:px-6 max-w-xs truncate">
                Título
              </th>

              <th className="w-48 px-4 py-3 md:px-6 hidden md:table-cell truncate">
                Contenido
              </th>
              <th
                className="w-24 px-4 py-3 md:px-6 bg-white sticky right-0 z-10"
                style={{ boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)" }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.id}
                className="bg-white border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-4 py-3 md:px-6 w-16">
                  {article.image ? (
                    <Image
                      src={
                        article.image.startsWith("http")
                          ? article.image
                          : article.image
                      }
                      alt={article.title}
                      width={50}
                      height={50}
                      className="rounded object-cover w-12 h-12"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                      <IoDocumentTextOutline
                        size={24}
                        className="text-slate-400"
                      />
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 md:px-6 font-medium text-slate-900 w-32 truncate max-w-full">
                  {article.author.name || "Autor Desconocido"}
                </td>

                <td className="px-4 py-3 md:px-6 max-w-xs truncate">
                  {article.category?.length > 0
                    ? article.category.join(", ")
                    : "Sin categoría"}
                </td>

                <td className="px-4 py-3 md:px-6 font-medium text-slate-900 min-w-[150px] max-w-xs truncate">
                  <Link
                    href={`/article/${article.slug}`}
                    className="hover:text-blue-600 transition-colors"
                    title={article.title}
                  >
                    {article.title}
                  </Link>
                  <p className="text-xs text-slate-500 uppercase truncate">
                    {article.id.split("-")[0]}
                  </p>
                </td>

                <td className="px-4 py-3 md:px-6 w-48 hidden md:table-cell truncate">
                  {stripHtml(article.content).slice(0, 100)}...
                </td>

                <td
                  className="px-4 py-4 md:px-6 w-30 bg-gray-100 sticky right-0 z-10 space-x-2 flex items-stretch"
                  style={{ boxShadow: "-2px 0 5px -2px rgba(0,0,0,0.1)" }}
                >
                  <Link
                    href={`/admin/blog/edit/${article.slug}`}
                    title="Editar artículo"
                    className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150 ease-in-out inline-flex items-center"
                  >
                    <IoPencil size={16} />
                  </Link>
                  <button
                    onClick={() =>
                      handleDeleteArticle(
                        article.id,
                        article.content,
                        article.image
                      )
                    }
                    title="Eliminar articulo"
                    className="flex-grow py-3 font-medium text-red-600 hover:text-red-800 transition-colors duration-150 ease-in-out inline-flex items-center justify-center"
                  >
                    <IoTrashOutline size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr className="bg-white border-b border-slate-200">
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No se encontraron artículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
