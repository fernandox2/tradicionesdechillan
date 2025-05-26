export const revalidate = 0;

import { redirect } from "next/navigation";
import { auth } from "@/auth.config";

import { Pagination, Title } from "@/components";
import { getPaginatedArticlesAdmin } from "@/actions/article/article-pagination";
import { IoWarningOutline } from "react-icons/io5";
import { Filters } from "./ui/filters/Filters";

import type { Article } from "@/interfaces";
import { ArticlesTable } from "./ui/ArticleTable";

interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default async function ListArticlePage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.query || undefined;

  const session = await auth();
  if (!session) redirect("/");

  const {
    ok,
    articles = [],
    totalPages = 0,
    totalArticles = 0,
    error,
  } = await getPaginatedArticlesAdmin({ page, query });

  if (!ok) redirect("/");

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <Title
            title="Listado de Artículos"
            subtitle="Administra, busca y visualiza los artículos del Blog."
          />
        </div>

        <div className="mb-6">
          <Filters placeholder="Buscar por título del artículo..." />
        </div>

        {!ok && error && (
          <div className="my-6 p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg flex items-center">
            <IoWarningOutline className="h-6 w-6 mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error al cargar los artículos</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {ok && (
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            {articles.length > 0 ? (
              <ArticlesTable articles={articles as Article[]} />
            ) : (
              <div className="text-center py-10 px-4">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
                </svg>
                <h3 className="mt-4 text-md font-semibold text-slate-800">
                  {query ? `No se encontraron artículos para "${query}"` : "No hay artículos para mostrar"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Prueba con otros términos de búsqueda o revisa más tarde.
                </p>
              </div>
            )}
          </div>
        )}

        {ok && totalArticles > 0 && (
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-semibold">{articles.length}</span> de <span className="font-semibold">{totalArticles}</span> artículos
            </p>
            {totalPages > 1 && (
              <Pagination totalPages={totalPages} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
