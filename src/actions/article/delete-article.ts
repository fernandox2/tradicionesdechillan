"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteArticle(id: string) {
  try {
    const deleted = await prisma.blog.delete({
      where: { id },
    })

    revalidatePath("/admin/blog")
    return { success: true, data: deleted }
  } catch (error) {
    console.error("Error al eliminar el blog:", error)
    return { success: false, error: "No se pudo eliminar el blog." }
  }
}