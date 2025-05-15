"use serve";

import { Size } from "@/interfaces";
import prisma from "@/lib/prisma";
import { Gender, Prisma } from "@prisma/client";
import { z, ZodError, ZodFormattedError } from 'zod';

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
  query?: string;
}

export interface PaginatedProduct {
  id: string;
  title: string;
  description: string;
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  gender: Gender;
  categoryId: string;
  images: string[];
}

interface GetPaginatedProductsAdminResponse {
  ok: boolean;
  products?: PaginatedProduct[];
  currentPage?: number;
  totalPages?: number;
  totalProducts?: number;
  error?: string;
}

export interface Category {
  id: string;
  name: string;
}

// Interfaz para los datos del producto que maneja el formulario
export interface ProductForForm {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  gender: Gender;
  categoryId: string;
  sizes: Size[];
  tags: string[];
  images: string[];
}

// Estado del formulario para useFormState
export interface ProductFormState {
  message: string;
  errors?: {
    id?: string[];
    title?: string[];
    slug?: string[];
    description?: string[];
    price?: string[];
    inStock?: string[];
    gender?: string[];
    categoryId?: string[];
    sizes?: string[];
    tags?: string[];
    images?: string[];
    image_0?: string[];
    image_1?: string[];
    _form?: string[];
  };
  success: boolean;
  isEdit: boolean;
  productId?: string;
}

export const getPaginatedProducts = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      //! Por género
      where: {
        gender: gender,
      },
    });

    // 2. Obtener el total de páginas
    // todo:
    const totalCount = await prisma.product.count({
      where: {
        gender: gender,
      },
    });
    
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => {
        const { ProductImage, ...resto } = product;
        return {
          ...resto,
          images: ProductImage.map((image) => image.url),
        };
      }),
    };
  } catch (error) {
    throw new Error("ocurrio un error al cargar los productos");
  }
};

export const getPaginatedProductsAdmin = async ({
  page = 1,
  take = 12,
  query,
}: PaginationOptions): Promise<GetPaginatedProductsAdminResponse> => {
  try {
    let currentPage = Number(page);
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

    let currentTake = Number(take);
    if (isNaN(currentTake) || currentTake < 1) currentTake = 12;

    const whereClause: Prisma.ProductWhereInput = {};
    const trimmedQuery = query?.trim();

    if (trimmedQuery && trimmedQuery !== "") {
      whereClause.title = {
        contains: trimmedQuery,
        mode: 'insensitive',
      };
    }

    const [productsFromDb, totalProducts] = await prisma.$transaction([
      prisma.product.findMany({
        take: currentTake,
        skip: (currentPage - 1) * currentTake,
        where: whereClause,
        include: {
          ProductImage: {
            take: 2,
            select: { url: true },
          },
        },
        orderBy: { title: 'desc' },
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalProducts / currentTake);

    const products: PaginatedProduct[] = productsFromDb.map((dbProduct): PaginatedProduct => {
      const productImages = dbProduct.ProductImage?.map((image) => image.url) || [];

      return {
        id: dbProduct.id,
        title: dbProduct.title,
        description: dbProduct.description ?? '',
        inStock: dbProduct.inStock,
        price: dbProduct.price,
        slug: dbProduct.slug,
        categoryId: dbProduct.categoryId,
        tags: dbProduct.tags as string[],
        gender: dbProduct.gender as Gender,
        sizes: dbProduct.sizes as Size[],
        images: productImages, // Igual que en getPaginatedProductsWithImages
      };
    });

    return {
      ok: true,
      products,
      currentPage: currentPage,
      totalProducts: totalProducts,
      totalPages,
    };
  } catch (error) {
    console.error('[getPaginatedProductsAdmin Action] Error:', error);
    const safeCurrentPage = Number(page);
    return {
      ok: false,
      products: [],
      currentPage: isNaN(safeCurrentPage) || safeCurrentPage < 1 ? 1 : safeCurrentPage,
      totalProducts: 0,
      totalPages: 0,
      error: 'No se pudo obtener la lista de productos.',
    };
  }
};


export async function upsertProductAction(
  _prevState: any,
  formData: FormData
): Promise<ProductFormState> {
  const errors: ProductFormState['errors'] = {};

  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString() ?? '';
  const slug = formData.get('slug')?.toString() ?? '';
  const description = formData.get('description')?.toString() ?? '';
  const price = formData.get('price')?.toString() ?? '';
  const inStock = formData.get('inStock')?.toString() ?? '';
  const gender = formData.get('gender')?.toString() ?? '';
  const categoryId = formData.get('categoryId')?.toString() ?? '';
  const sizes = formData.getAll('sizes').map((s) => s.toString());
  const tags = formData.get('tags')?.toString() ?? '';
  const image_0 = formData.get('image_0')?.toString() ?? '';
  const image_1 = formData.get('image_1')?.toString() ?? '';

  // Validaciones simples
  if (!title.trim()) errors.title = ['El título es requerido'];
  if (!slug.trim()) errors.slug = ['El slug es requerido'];
  if (!description.trim()) errors.description = ['La descripción es requerida'];
  if (!price || isNaN(Number(price))) errors.price = ['El precio debe ser un número válido'];
  if (!inStock || isNaN(Number(inStock))) errors.inStock = ['El stock debe ser un número válido'];
  if (!gender.trim()) errors.gender = ['El género es requerido'];
  if (!categoryId.trim()) errors.categoryId = ['La categoría es requerida'];
  if (sizes.length === 0) errors.sizes = ['Debes seleccionar al menos una talla'];
  if (!tags.trim()) errors.tags = ['Debes agregar al menos una etiqueta'];
  if (!image_0.trim()) errors.image_0 = ['Debes subir una imagen principal'];
  if (!image_1.trim()) errors.image_1 = ['Debes subir una segunda imagen'];

  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    return {
      success: false,
      message: 'Hay errores en el formulario',
      errors,
      isEdit: !!id,
    };
  }

  // Simular guardado
  const savedProduct = {
    id: id ?? 'nuevo_id_generado',
  };

  return {
    success: true,
    message: savedProduct.id
      ? 'Producto actualizado correctamente'
      : 'Producto creado correctamente',
    isEdit: !!id,
    productId: savedProduct.id,
  };
}