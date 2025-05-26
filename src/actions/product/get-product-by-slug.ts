'use server';

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: {
          select: {
            id: true,
            url: true,
            productId: true,
          },
        },
      },
      where: {
        slug: slug,
      },
    });

    if (!product) return null;

    return {
        ...product,
        images: product.ProductImage.map(image => image.url),
    }

  } catch (error) {
    return null
  }
};


