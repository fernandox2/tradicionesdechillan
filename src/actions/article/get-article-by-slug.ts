import prisma from "@/lib/prisma";

export const getArticleBySlug = async (slug: string) => {
    try {
      const article = await prisma.blog.findFirst({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
  
      if (!article) return null;
  
      return {
        ...article,
        imageUrl: article.image,
      };
    } catch (error) {
      console.error('Error al obtener el artículo:', error);
      return null;
    }
  };