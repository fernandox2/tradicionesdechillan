'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import prisma from '@/lib/prisma';


export const deleteBlogImage = async (blogId: string) => {
  try {
    // Obtener el blog y su imagen
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { image: true, slug: true },
    });

    if (!blog || !blog.image) {
      return { ok: false, error: 'No se encontró el blog o no tiene imagen' };
    }

    const imageName = blog.image.split('/').pop(); // nombre de archivo
    if (!imageName) {
      return { ok: false, error: 'Nombre de imagen inválido' };
    }

    const imagePath = path.join(process.cwd(), 'public', 'imgs', 'blog', imageName);

    // Eliminar archivo del sistema
    await fs.unlink(imagePath);

    // Limpiar el campo image en la base de datos
    await prisma.blog.update({
      where: { id: blogId },
      data: { image: '' },
    });

    // Revalidar las rutas del blog
    revalidatePath(`/admin/articles`);
    revalidatePath(`/admin/articles/${blog.slug}`);
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
