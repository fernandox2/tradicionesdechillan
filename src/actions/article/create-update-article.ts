"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { BlogCategory } from "@prisma/client";
import { saveImage } from "../imagenes/upload-images";

// export const createUpdateArticle = async (formData: FormData) => {
//   const data = Object.fromEntries(formData.entries());
//   const rawCategories = formData.getAll("category") as string[];

//   const { id, title, slug, content, authorId } = data;

//   try {
//     const image = formData.getAll("image") as File[];

//     const savedImages = await uploadArticleImage(image);

//     const article = id
//       ? await prisma.blog.update({
//           where: { id: String(id) },
//           data: {
//             title: String(title),
//             slug: String(slug).toLowerCase().replace(/ /g, "-"),
//             content: String(content),
//             category: rawCategories.map((cat) => cat as BlogCategory),
//             image: savedImages?.[0] || undefined,
//           },
//         })
//       : await prisma.blog.create({
//           data: {
//             title: String(title),
//             slug: String(slug).toLowerCase().replace(/ /g, "-"),
//             content: String(content),
//             category: rawCategories.map((cat) => cat as BlogCategory),
//             image: savedImages?.[0] || "",
//             authorId: String(authorId),
//           },
//         });

//     revalidatePath("/admin/blog");
//     revalidatePath(`/admin/blog/${article.slug}`);

//     return {
//       ok: true,
//       article,
//       message: id ? "Artículo actualizado" : "Artículo creado",
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       ok: false,
//       message: "Error al guardar el artículo",
//     };
//   }
// };

// Esta función sube todas las imágenes y devuelve un array de URLs
export const uploadArticleImage = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];

  for (const file of files) {
    // Convierte File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Llama a la función que guarda la imagen (en FTP o local)
    const imageUrl = await saveImage(buffer, file.name);

    urls.push(imageUrl);
  }

  return urls;
};

export const createUpdateArticle = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const rawCategories = formData.getAll("category") as string[];

  const { id, title, slug, content, authorId } = data;

  try {
    const images = formData.getAll("image") as File[];

    const savedImages = await uploadArticleImage(images);

    const article = id
      ? await prisma.blog.update({
          where: { id: String(id) },
          data: {
            title: String(title),
            slug: String(slug).toLowerCase().replace(/ /g, "-"),
            content: String(content),
            category: rawCategories.map((cat) => cat as BlogCategory),
            image: savedImages?.[0] || undefined,
          },
        })
      : await prisma.blog.create({
          data: {
            title: String(title),
            slug: String(slug).toLowerCase().replace(/ /g, "-"),
            content: String(content),
            category: rawCategories.map((cat) => cat as BlogCategory),
            image: savedImages?.[0] || "",
            authorId: String(authorId),
          },
        });

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${article.slug}`);

    return {
      ok: true,
      article,
      message: id ? "Artículo actualizado" : "Artículo creado",
    };
  } catch (error:any) {
    console.error('Error en createUpdateArticle:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return { ok: false, message: 'El slug ya está en uso.', code: 'P2002' };
    }
    return {
      ok: false,
      message: "Error al guardar el artículo",
    };
  }
};
