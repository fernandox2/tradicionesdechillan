'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';
import { Client } from 'basic-ftp';

export const deleteBlogImage = async (blogId: string) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { image: true, slug: true },
    });

    if (!blog || !blog.image) {
      return { ok: false, error: 'No se encontró el blog o no tiene imagen' };
    }

    const imageName = blog.image.split('/').pop();
    if (!imageName) {
      return { ok: false, error: 'Nombre de imagen inválido' };
    }

    const imagePath = path.join(process.cwd(), 'public', 'imgs', 'blog', imageName);

    await fs.unlink(imagePath);

    await prisma.blog.update({
      where: { id: blogId },
      data: { image: '' },
    });

    revalidatePath(`/admin/blog`);
    revalidatePath(`/admin/blog/${blog.slug}`);
    revalidatePath(`/blog/${blog.slug}`);

    return { ok: true };

  } catch (error) {
    console.error('Error al eliminar imagen del blog:', error);
    return {
      ok: false,
      error: 'No se pudo eliminar la imagen',
    };
  }
};

export const deleteImageFTP = async (imageUrl: string, id: string): Promise<{ ok: boolean, error?: string }> => {

    const fileName = imageUrl.split('/').pop();
    if (!fileName || fileName.trim() === "" || fileName === "." || fileName === "..") {
        return { ok: false, error: 'Nombre de imagen inválido o URL no válida para eliminación FTP.' };
    }

    const blog = await prisma.blog.findUnique({
      where: { id: id },
      select: { image: true, slug: true },
    });

    const client = new Client();
    try {
        await client.access({
            host: "ftp.cecinastradicionesdechillan.cl",
            port: 21,
            user: "tradicionesftp@tradicionesdechillan.cl",
            password: "##*q4hB)AACf",
            secure: true,
            secureOptions: {
                rejectUnauthorized: false,
            },
        });

        await client.remove(fileName);

        revalidatePath(`/admin/blog`);

        await prisma.blog.update({
          where: { id: id },
          data: { image: '' },
        });

    revalidatePath(`/admin/blog/${blog?.slug}`);
    revalidatePath(`/blog/${blog?.slug}`);
        return { ok: true };

    } catch (ftpError: any) {
        console.error(`Error al eliminar imagen "${fileName}" del servidor FTP:`, ftpError);
        let userMessage = `No se pudo eliminar la imagen "${fileName}" del servidor FTP.`;
        if (ftpError.code === 550) {
            userMessage = `Archivo "${fileName}" no encontrado en el servidor FTP o permiso denegado para eliminar.`;
        }
        return { ok: false, error: userMessage };
    } finally {
        if (!client.closed) {
            client.close();
        }
    }
};

async function deleteImageFTPContent(imageUrl: string): Promise<{ ok: boolean, error?: string }> {
  const fileName = imageUrl.split('/').pop();
  if (!fileName || fileName.trim() === "" || fileName === "." || fileName === "..") {
      console.error('Server Action (deleteImageFTP): URL de imagen inválida:', imageUrl);
      return { ok: false, error: 'Nombre de imagen inválido o URL no válida.' };
  }

  const client = new Client();
  try {
        await client.access({
          host: "ftp.cecinastradicionesdechillan.cl",
          port: 21,
          user: "tradicionesftp@tradicionesdechillan.cl",
          password: "##*q4hB)AACf",
          secure: true,
          secureOptions: {
              rejectUnauthorized: false,
          },
      });

      await client.remove(fileName);
      return { ok: true };
  } catch (ftpError: any) {
      let userMessage = `No se pudo eliminar la imagen "${fileName}" del FTP.`;
      if (ftpError.code === 550) { // No such file or directory / Permission denied
          userMessage = `Archivo "${fileName}" no encontrado en FTP o permiso denegado. (Error 550)`;
      }
      return { ok: false, error: userMessage };
  } finally {
      if (!client.closed) {
          client.close();
      }
  }
}

export async function action_deleteSingleFtpImage(imageUrl: string) {
  return await deleteImageFTPContent(imageUrl);
}