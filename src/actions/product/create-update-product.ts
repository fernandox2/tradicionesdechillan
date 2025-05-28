'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Gender, Product, Size } from '@prisma/client';
import { z } from 'zod';
import {v2 as cloudinary} from 'cloudinary';
import { saveImage } from '../imagenes/upload-images';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform( val => Number(val.toFixed(2)) ),
  inStock: z.coerce
    .number()
    .min(0)
    .transform( val => Number(val.toFixed(0)) ),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform( val => val.split(',') ),
  tags: z.string(),
  gender: z.nativeEnum(Gender), 
});

export const uploadArticleImage = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await saveImage(buffer, file.name);

    urls.push(imageUrl);
  }
  return urls;
};

export const createUpdateProduct = async( formData: FormData ) => {

    const data = Object.fromEntries( formData );
    const productParsed = productSchema.safeParse( data );
  
    if ( !productParsed.success) {
      return { ok: false }
    }
  
    const product = productParsed.data;
    product.slug = product.slug.toLowerCase().replace(/ /g, '-' ).trim();
  
    const { id, ...rest } = product;
  
    try {
      const prismaTx = await prisma.$transaction( async (tx) => {
    
        let product: Product;
        const tagsArray = rest.tags.split(',').map( tag => tag.trim().toLowerCase() );
    
        if ( id ) {
          // Actualizar
          product = await prisma.product.update({
            where: { id },
            data: {
              ...rest,
              sizes: {
                set: rest.sizes as Size[],
              },
              tags: {
                set: tagsArray
              }
            }
          });
    
        } else {
          // Crear
          product = await prisma.product.create({
            data: {
              ...rest,
              sizes: {
                set: rest.sizes as Size[],
              },
              tags: {
                set: tagsArray
              }
            }
          })
        }
    
        if ( formData.getAll('images') ) {
          const images = await uploadArticleImage(formData.getAll('images') as File[]);
          if ( !images ) {
            throw new Error('No se pudo cargar las imágenes, rollingback');
          }
        
          const savaImages = await prisma.productImage.createMany({
            data: images.map( image => ({
              url: image!,
              productId: product.id,
            }))
          });
        }

        return {
          product
        }
      });
  
      // Todo: RevalidatePaths
      revalidatePath('/admin/products');
      revalidatePath(`/admin/product/${ product.slug }`);
      revalidatePath(`/products/${ product.slug }`);
  
      return {
        ok: true,
        product: prismaTx.product,
        meesage: id ? 'Producto actualizado' : 'Producto creado',
      }
  
    } catch (error) {
      
      return {
        ok: false,
        message: 'Revisar los logs, no se pudo actualizar/crear'
      }
    }
  
  }
  