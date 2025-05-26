"use client";

import { useEffect } from "react";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Mensaje } from "@/components/ui/toast/Toast";
import { createUpdateArticle } from "@/actions";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import MenuBar from "@/components/MenuBarTiptap";
import ImageExtension from '@tiptap/extension-image';
import { deleteBlogImage } from "@/actions/article/delete-article-image";

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
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Escribe el contenido...' }),
      ImageExtension,
    ],
    content: article.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue('content', html, { shouldValidate: true });
    },
  });

  const { handleSubmit, register, watch, setValue } = useForm<FormInputs>({
    defaultValues: {
      ...article,
      image: undefined,
      categoryId: categoriesFromDB,
    },
  });

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    const { image, title, slug, content, categoryId } = data;

    if (article?.id) {
      formData.append("id", article.id);
    }

    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    formData.append("authorId", userId);

    if (categoryId && categoryId.length > 0) {
      categoryId.forEach((cat) => {
        formData.append("category", cat);
      });
    }

    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append("image", image[i]);
      }
    }

    try {
      const result = await createUpdateArticle(formData);

      if (!result.ok) {
        if (
          !article?.id &&
          result.message.includes("slug") &&
          result.message.includes("P2002")
        ) {
          Mensaje(
            "El slug ya está en uso, por favor cambia el título.",
            "error",
            {
              title: "Slug duplicado",
            }
          );
        } else {
          Mensaje(
            "El slug ya está en uso, por favor cambia el título.",
            "error",
            {
              title: "Slug Duplicado",
            }
          );
        }
        return;
      }

      if (!result.ok) {
        Mensaje("", "error", { title: result.message });
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
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-1 gap-3"
    >
      <div className="w-full">
        
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            disabled
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Contenido</span>
          <div className="border rounded-md bg-gray-50 p-2 min-h-[200px] prose prose-sm max-w-none">
  <MenuBar editor={editor} />
  <EditorContent editor={editor} className="tiptap" />
</div>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categorías</span>
          <select
            multiple
            className="p-2 border rounded-md bg-gray-200 h-40"
            {...register("categoryId", { required: true })}
          >
            {blogCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {article.id ? (
          <button className="bg-blue-600 py-3 rounded-md text-white w-full">
            Actualizar
          </button>
        ) : (
          <button className="bg-green-600 py-3 rounded-md text-white w-full">
            Guardar
          </button>
        )}
      </div>

      <div className="w-full">
        <div className="flex flex-col">
          <div className="flex flex-col mb-2">
            <span>Imagen del articulo</span>
            <input
              type="file"
              {...register("image")}
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {article.image && (
              <div>
                <Image
                  alt={article.title ?? ""}
                  src={article.image}
                  width={300}
                  height={300}
                  className="rounded-t shadow-md"
                />
                <button
                  type="button"
                  onClick={() => deleteBlogImage(article?.id as string)}
                  className="btn-danger w-full rounded-b-xl"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
