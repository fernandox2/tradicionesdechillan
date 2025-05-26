"use server";

import { revalidatePath } from "next/cache";
import { uploadArticleImage } from "@/actions";
import prisma from "@/lib/prisma";
import { BlogCategory } from "@prisma/client";

export const createUpdateArticle = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  const rawCategories = formData.getAll("category") as string[];

  const { id, title, slug, content, authorId } = data;

  try {
    const image = formData.getAll("image") as File[];

    const savedImages = await uploadArticleImage(image);

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
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al guardar el artículo",
    };
  }
};
