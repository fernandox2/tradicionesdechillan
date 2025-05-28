"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Mensaje } from "@/components/ui/toast/Toast";
import { createUpdateArticle } from "@/actions";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import MenuBar from "@/components/MenuBarTiptap";
import ImageExtension from "@tiptap/extension-image";
import { deleteImageFTP } from "@/actions/article/delete-article-image";
import axios from "axios";

interface Article {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  category?: string[];
  image?: string;
  authorId?: string;
}

interface Props {
  article: Article;
  userId: string;
}

interface FormInputs {
  title: string;
  slug: string;
  content: string;
  inStock: number;
  categoryId: string[];
  image?: FileList;
}

const blogCategories = [
  { value: "moda", label: "Moda" },
  { value: "estilo_de_vida", label: "Estilo de Vida" },
  { value: "viajes", label: "Viajes" },
  { value: "comida", label: "Comida" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "salud", label: "Salud" },
  { value: "fitness", label: "Fitness" },
  { value: "belleza", label: "Belleza" },
  { value: "entretenimiento", label: "Entretenimiento" },
  { value: "educacion", label: "Educación" },
  { value: "deportes", label: "Deportes" },
  { value: "arte", label: "Arte" },
  { value: "musica", label: "Música" },
  { value: "ciencia", label: "Ciencia" },
  { value: "negocios", label: "Negocios" },
  { value: "fotografia", label: "Fotografía" },
  { value: "literatura", label: "Literatura" },
  { value: "historia", label: "Historia" },
  { value: "naturaleza", label: "Naturaleza" },
  { value: "cine", label: "Cine" },
];

export const ArticleForm = ({ article, userId }: Props) => {
  const router = useRouter();

  const categoriesFromDB = article.category ?? [];

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Escribe el contenido..." }),
      ImageExtension,
    ],
    content: article.content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("content", html, { shouldValidate: true });
    },
  });

  const { handleSubmit, register, watch, setValue } = useForm<FormInputs>({
    defaultValues: {
      ...article,
      image: undefined,
      categoryId: categoriesFromDB,
    },
  });

  const prevImagesRef = useRef<string[]>([]);

  useEffect(() => {
    if (article && article.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.content, "text/html");
      const initialFtpImages = Array.from(doc.querySelectorAll("img"))
        .map((img) => img.getAttribute("src") || "")
        .filter((src) =>
          src.startsWith(
            "https://ntx-05-lon-cp41.netexplora.com/~cecin947/tradicionesdechillan.cl/tradicionesftp/"
          )
        );
      prevImagesRef.current = initialFtpImages;
    } else {
      prevImagesRef.current = [];
    }
  }, [article]);

  async function base64ToJpgBlob(base64: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener contexto de canvas"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo crear el blob JPG"));
          },
          "image/jpeg",
          0.92
        );
      };
      img.onerror = (e) => reject(e);
      img.src = base64;
    });
  }

  const processBase64Images = async (doc: Document) => {
    const imgElements = Array.from(doc.querySelectorAll("img"));

    for (const img of imgElements) {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:")) {
        try {
          const jpgBlob = await base64ToJpgBlob(src);
          const uploadData = new FormData();
          uploadData.append("image", jpgBlob, "image.jpg");

          const res = await axios.post("/api/upload-images", uploadData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.status === 200 && res.data.imageUrl) {
            img.setAttribute("src", res.data.imageUrl);
          }
        } catch (error) {
          console.error("Error subiendo imagen del contenido:", error);
        }
      }
    }
  };

  const onSubmit = async (data: FormInputs) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.content, "text/html");

    await processBase64Images(doc);

    const contentAfterBase64Processing = doc.body.innerHTML;
    const contentToSaveToDb = contentAfterBase64Processing;

    const formData = new FormData();
    const { image, title, slug, categoryId } = data;

    if (article?.id) formData.append("id", article.id);
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("content", contentToSaveToDb);
      formData.append("authorId", userId);

    if (categoryId?.length) {
      categoryId.forEach((cat) => formData.append("category", cat));
    }

    if (image?.length) {
      for (let i = 0; i < image.length; i++) {
        formData.append("image", image[i]);
      }
    }

    try {
      const result = await createUpdateArticle(formData);

      if (!result.ok) {
        if (!article?.id && result.code === "P2002") {
          Mensaje(
            "El slug ya está en uso, por favor cambia el título.",
            "error",
            {
              title: "Slug duplicado",
            }
          );
        } else {
          Mensaje(result.message || "Error al guardar el artículo", "error", {
            title: "Error",
          });
        }
        return;
      }

      Mensaje("El Articulo ha sido creado exitosamente!", "success", {
        title: result.message,
      });
      router.replace("/admin/blog");
    } catch (err) {
      console.error(err);
      Mensaje("", "error", { title: "Error al guardar el artículo" });
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        const slugGenerated = generateSlug(value.title || "");
        setValue("slug", slugGenerated, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 gap-6 grid-cols-1 md:grid-cols-2"
    >
      <div className="col-span-1 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-100 w-full"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span>Slug</span>
          <input
            disabled
            type="text"
            className="p-2 border rounded-md bg-gray-100 w-full"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <span>Imagen del artículo</span>
          <input
            type="file"
            {...register("image")}
            className="p-2 border rounded-md bg-gray-100 w-full"
            accept="image/png, image/jpeg, image/avif"
          />

          {article.image && (
            <div className="mt-2 group">
              <div className="relative w-full max-w-[250px] aspect-square rounded shadow-md overflow-hidden">
                <Image
                  alt={article.title ?? "Imagen del artículo"}
                  src={article.image}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  onClick={() =>
                    deleteImageFTP(
                      article?.image as string,
                      article.id as string
                    )
                  }
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md z-10 opacity-75 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span>Categorías</span>
          <select
            multiple
            className="p-2 border rounded-md bg-gray-100 h-40 w-full"
            {...register("categoryId", { required: true })}
          >
            {blogCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
        <span>Contenido</span>
        <div className="border rounded-md bg-gray-50 p-2 min-h-[200px] prose prose-sm max-w-none">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="tiptap" />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        {article.id ? (
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 py-3 rounded-md text-white w-full transition-colors"
          >
            Actualizar
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 py-3 rounded-md text-white w-full transition-colors"
          >
            Guardar
          </button>
        )}
      </div>
    </form>
  );
};
