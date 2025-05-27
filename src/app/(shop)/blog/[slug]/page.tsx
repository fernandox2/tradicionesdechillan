import Image from "next/image";
import { getArticleBySlug } from "@/actions/article/get-article-by-slug";


export const dynamic = "force-dynamic";

interface Props {
  params: {
    slug: string;
  };
}

export default async function BlogPage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold text-red-600">Artículo no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-zinc-900 via-black to-zinc-900 text-white max-w-[1440px] mx-auto">
      {/* Hero */}
      <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover brightness-[.6]"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl leading-tight drop-shadow-lg">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-gray-300">
            Publicado el{" "}
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Fecha desconocida"}{" "}
            por{" "}
            <span className="font-medium text-white">
              {article.author?.name || "Autor desconocido"}
            </span>
          </p>
        </div>
      </section>

      {/* Artículo */}
      <article className="relative px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-20 max-w-[1920px] mx-auto">
        {/* Categorías */}
        <div className="flex flex-wrap gap-3 mb-6">
          {article.category.map((cat) => (
            <span
              key={cat}
              className="bg-orange-650 text-white text-xs font-semibold px-4 py-1 rounded-full tracking-wide uppercase"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Contenido */}
        <div
          className="prose prose-invert prose-lg lg:prose-xl max-w-none text-justify leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  );
}
