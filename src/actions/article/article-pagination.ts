import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  query?: string;
}

interface PaginatedArticle {
  id: string;
  title: string;
  slug: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  category: string[];
  author: {
    id: string;
    name: string;
  } | null;
}

interface GetPaginatedArticlesAdminResponse {
  ok: boolean;
  articles: PaginatedArticle[];
  currentPage: number;
  totalArticles: number;
  totalPages: number;
  error?: string;
}

export const getPaginatedArticlesAdmin = async ({
  page = 1,
  take = 10,
  query,
}: PaginationOptions): Promise<GetPaginatedArticlesAdminResponse> => {
  try {
    let currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

    let currentTake = Number(take);
    if (isNaN(currentTake) || currentTake < 1) currentTake = 10;

    const whereClause: Prisma.BlogWhereInput = {};
    const trimmedQuery = query?.trim();

    if (trimmedQuery && trimmedQuery !== "") {
      whereClause.title = {
        contains: trimmedQuery,
        mode: "insensitive",
      };
    }

    const [articlesFromDb, totalArticles] = await prisma.$transaction([
      prisma.blog.findMany({
        take: currentTake,
        skip: (currentPage - 1) * currentTake,
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
            author: {
              select: {
                id: true,
                name: true,  // Asumo que tu modelo User tiene un campo 'name'
              },
            },
        },
      }),
      prisma.blog.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalArticles / currentTake);

    const articles: PaginatedArticle[] = articlesFromDb.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      image: article.image || "",
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: article.category.map((cat) => cat as string),
      author: article.author ? {
        id: article.author.id,
        name: article.author.name,
      } : null,
    }));

    return {
      ok: true,
      articles,
      currentPage,
      totalArticles,
      totalPages,
    };
  } catch (error) {
    console.error("[getPaginatedArticlesAdmin Action] Error:", error);
    const safeCurrentPage = Number(page);
    return {
      ok: false,
      articles: [],
      currentPage: isNaN(safeCurrentPage) || safeCurrentPage < 1 ? 1 : safeCurrentPage,
      totalArticles: 0,
      totalPages: 0,
      error: "No se pudo obtener la lista de artículos.",
    };
  }
};
