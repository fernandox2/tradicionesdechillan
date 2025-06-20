"use client";

import { useForm } from "react-hook-form";
import { Product, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
// import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/product/product-image/ProductImage";
import { createUpdateProduct } from "@/actions/product/create-update-product";
import { Category } from "@/interfaces/category.interface";
import { Mensaje } from "@/components/ui/toast/Toast";
import {
  deleteImageFTP,
  deleteProductImage,
} from "@/actions/product/delete-product-image";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

const sizes = [
  "NINE_HUNDRED_GRAMS",
  "FOUR_HUNDRED_FIFTY_GRAMS",
  "TWO_HUNDRED_FIFTY_GRAMS",
];

const sizeLabels: Record<string, string> = {
  TWO_HUNDRED_FIFTY_GRAMS: "250GRMS",
  NINE_HUNDRED_GRAMS: "900GRMS",
  FOUR_HUNDRED_FIFTY_GRAMS: "450GRMS",
};

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  // gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;

  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const [load, setLoad] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  watch("sizes");

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues("sizes"));
    sizes.has(size) ? sizes.delete(size) : sizes.add(size);
    setValue("sizes", Array.from(sizes));
  };

  const onSubmit = async (data: FormInputs) => {
    setLoad(true);
  
    const formData = new FormData();
    const { images, ...productToSave } = data;
  
    if (product.id) {
      formData.append("id", product.id ?? "");
    }
  
    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
  
    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }
  
    try {
      const {
        ok,
        product: updatedProduct,
        message,
      } = await createUpdateProduct(formData);
  
      if (!ok) {
        Mensaje("Hubo un error al crear el producto!", "error", {
          title: message,
        });
        return;
      }
  
      Mensaje("", "success", {
        title: message,
      });
  
      router.replace(`/admin/products`);
    } catch (error) {
      Mensaje("Error inesperado", "error", {
        title: "No se pudo guardar el producto",
      });
    } finally {
      setLoad(false);
    }
  };
  
  const deleteImageProducto = async (id: number, url: string) => {
    deleteImageFTP(url, id);
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
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
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
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {product.id ? (
          <button
            disabled={load}
            className="bg-blue-600 py-3 rounded-md text-white w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {load ? (
              <>
                <AiOutlineLoading className="animate-spin h-5 w-5" />
                Actualizando...
              </>
            ) : (
              "Actualizar"
            )}
          </button>
        ) : (
          <button
            disabled={load}
            className="bg-green-600 py-3 rounded-md text-white w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {load ? (
              <>
                <AiOutlineLoading className="animate-spin h-5 w-5" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        )}
      </div>

      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Peso</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-22 transition-all text-center",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
              >
                <span>{sizeLabels[size]}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              type="file"
              {...register("images")}
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif, image/webp"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.ProductImage?.map((image, index) => {
              return (
                <div key={index}>
                  <ProductImage
                    alt={product.title ?? ""}
                    src={image.url}
                    width={300}
                    height={300}
                    className="rounded-t shadow-md"
                  />

                  <button
                    type="button"
                    onClick={() => deleteImageProducto(image.id, image.url)}
                    className="btn-danger w-full rounded-b-xl"
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
};
