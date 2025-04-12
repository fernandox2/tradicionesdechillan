"use serve";

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProducts = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      //! Por género
      where: {
        gender: gender,
      },
    });

    // 2. Obtener el total de páginas
    // todo:
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    });
    
    const totalPages = Math.ceil(totalCount / take);


    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => {
        const { ProductImage, ...resto } = product;
        return {
          ...resto,
          images: ProductImage.map((image) => image.url),
        };
      }),
    };
  } catch (error) {
    throw new Error("ocurrio un error al cargar los productos");
  }
};
