'use server'

import prisma from "@/lib/prisma";
import { deleteImageFTP } from "./delete-product-image";

export const deleteProduct = async (productId: string) => {
  try {
    const productImages = await prisma.productImage.findMany({
      where: { productId },
      select: { id: true, url: true },
    });

    for (const image of productImages) {
      const { ok, error } = await deleteImageFTP(image.url, image.id);
      if (!ok) {
        console.warn(`No se pudo eliminar la imagen FTP ${image.url}: ${error}`);
      }
    }

    await prisma.productImage.deleteMany({
      where: { productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    console.log(`Producto ${productId} y sus imágenes eliminadas correctamente.`);
    return { ok: true };

  } catch (error) {
    console.error("Error eliminando producto:", error);
    return { ok: false, error: "Error eliminando producto" };
  }
};
