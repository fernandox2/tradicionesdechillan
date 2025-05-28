'use server';

import prisma from '@/lib/prisma';
import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );
import { Client } from "basic-ftp";
import { getFtpClientAndConnect } from '@/lib/ftp';

export const deleteProductImage = async( imageId: number, imageUrl: string ) => {

  if ( !imageUrl.startsWith('http') ) {
    return {
      ok: false,
      error: 'No se pueden borrar imagenes de FS'
    }
  }

  const imageName = imageUrl
    .split('/')
    .pop()
    ?.split('.')[0] ?? '';

  try {

    await cloudinary.uploader.destroy( imageName );
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId
      },
      select: {
        product: {
          select: {
            slug: true
          }
        }
      }
    })

    // Revalidar los paths
    revalidatePath(`/admin/products`)
    revalidatePath(`/admin/products/${ deletedImage.product.slug }`);
    revalidatePath(`/product/${ deletedImage.product.slug }`);

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la imagen'
    }
  }
}

export const deleteImageFTP = async (
  imageUrl: string,
  id: number
): Promise<{ ok: boolean; error?: string }> => {
  const fileName = imageUrl.split("/").pop();
  if (!fileName || fileName.trim() === "" || fileName === "." || fileName === "..") {
    return { ok: false, error: "Nombre de imagen inválido o URL no válida para eliminación FTP." };
  }

  const imageRecord = await prisma.productImage.findUnique({
    where: { id },
    select: {
      url: true,
      product: {
        select: {
          slug: true,
          id: true,
        },
      },
    },
  });

  if (!imageRecord) {
    return { ok: false, error: `Imagen con ID "${id}" no encontrada.` };
  }

  let client: Client | null = null;

  try {
    client = await getFtpClientAndConnect();

    await client.remove(fileName);

    await prisma.productImage.delete({
      where: { id },
    });

    if (imageRecord.product?.slug) {
      revalidatePath(`/admin/product/${imageRecord.product.slug}`);
      revalidatePath(`/product/${imageRecord.product.slug}`);
    }

    return { ok: true };
  } catch (ftpError: any) {
    console.error(`Error al eliminar imagen "${fileName}" del servidor FTP:`, ftpError);
    let userMessage = `No se pudo eliminar la imagen "${fileName}" del servidor FTP.`;
    if (ftpError.code === 550) {
      userMessage = `Archivo "${fileName}" no encontrado en el servidor FTP o permiso denegado para eliminar.`;
    }
    return { ok: false, error: userMessage };
  } finally {
    if (client && !client.closed) {
      client.close();
    }
  }
};